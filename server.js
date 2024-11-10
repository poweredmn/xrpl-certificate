const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const { MongoClient } = require("mongodb");
const xrpl = require("xrpl");

// Set up in-memory storage
const upload = multer({ storage: multer.memoryStorage() });

const app = express();
const PORT = 3000;

// RippleAPI setup
const wallet = xrpl.Wallet.fromSeed(process.env.SOURCE_SECRET);
const api = new xrpl.Client("wss://xahau-test.net/");
api.on("error", (errorCode, errorMessage) => {
  console.log(errorCode + ": " + errorMessage);
});
api.on("connected", () => {
  console.log("RippleAPI connected");
});
api.on("disconnected", (code) => {
  console.log("RippleAPI disconnected, code:", code);
});

// MongoDB connection setup
const mongoUri = process.env.MONGO_URI;
const client = new MongoClient(mongoUri);
let db;

client.connect().then(() => {
  db = client.db("xrp_payments");
  console.log("Connected to MongoDB");
});

app.post("/upload-file", upload.single("file"), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const hashBuffer = crypto.createHash("sha256").update(fileBuffer).digest();
    const hashHex = hashBuffer.toString("hex");

    const collection = db.collection("file_hashes");
    await collection.insertOne({ hash: hashHex, createdAt: new Date() });

    const payment = {
      Account: wallet.address,
      TransactionType: "Payment",
      Amount: `${BigInt(Math.ceil(fileBuffer.length / 1000))}0000000`, // 1 XRP per 1KB
      Destination: wallet.address,
      Fee: "100000",
      Memos: [
        {
          Memo: {
            MemoType: "Hash",
            MemoData: hashHex.toUpperCase(),
          },
        },
      ],
    };

    await api.connect();
    const signedPayment = wallet.sign(payment);
    const response = await client.submit(signedPayment.tx_blob);

    await api.disconnect();

    res.json({
      status: "success",
      hash: hashHex,
      transactionResult: response.resultCode,
      resultMessage: response.resultMessage,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to process transaction." });
  }
});

app.post("/check-hash", upload.single("file"), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const hashBuffer = crypto.createHash("sha256").update(fileBuffer).digest();
    const hashHex = hashBuffer.toString("hex");

    await api.connect();

    const stateKey = hashHex.toUpperCase();
    const response = await api.request("account_objects", {
      account: wallet.address,
      type: "state",
      ledger_index: "validated",
      limit: 100,
    });

    const existingState = response.account_objects.find(
      (obj) => obj.Memos && obj.Memos[0].Memo.MemoData === stateKey
    );

    if (existingState) {
      res.json({
        status: "success",
        message: "Hash exists in hook's state.",
        timestamp: existingState.date,
      });
    } else {
      res.json({
        status: "not_found",
        message: "Hash does not exist in hook's state.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Failed to check hash." });
  } finally {
    await api.disconnect();
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
