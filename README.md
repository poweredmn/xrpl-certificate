## Prerequisites

- **Node.js** (version X.X.X or later)
- **MongoDB**
- **RippleAPI** (`xrpl.js` library)
- **wasmcc** (WebAssembly compiler)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/poweredmn/xrpl-certificate.git
   cd xrpl-certificate
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the project root and add the following values:

   ```bash
   SOURCE_SECRET=<Your Ripple Wallet Secret>
   MONGO_URI=<Your MongoDB URI>
   ```

   > **Note:** Ensure that you replace `<Your Ripple Wallet Secret>` and `<Your MongoDB URI>` with your actual credentials.

## Compilation / Deployment

1. **Upload the C code** to the XRPL hook builder:  
   [XRPL Hook Builder](https://hooks-builder.xrpl.org/)

2. **Compile the C code** into a WebAssembly module.

3. **Deploy the WebAssembly module** to the hook account. You can monitor the transaction at the [Xahau Testnet Explorer](https://explorer.xahau-test.net/).

4. **Configure your `.env` file** with the hook account's seed (for deployment):

   ```bash
   SOURCE_SECRET=<Your Hook Account's seed>
   ```

## Usage

1. **Start the server**:

   ```bash
   npm start
   ```

2. **Upload a file** to store its hash on the blockchain:

   ```bash
   curl -F "file=@path/to/your/file" http://localhost:3000/upload-file
   ```

3. **Check if a file's hash exists** on the blockchain:

   ```bash
   curl -F "file=@path/to/your/file" http://localhost:3000/check-hash
   ```

## Project Files

- **`server.js`**: Main server file for handling file uploads and hash verification.
- **`certificate.c`**: C code containing the hook logic for interacting with the XRPL blockchain.
- **`hookapi.h`**: Header file for hook API functions.
- **`hookmacro.h`**: Header file for helper macros used in the hook logic.
- **`sfcodes.h`**: Header file for XRPL transaction field codes.
- **`makefile`**: Makefile for compiling the WebAssembly module.
- **`.env`**: Environment variables file (not included in the repository for security reasons).
- **`.gitignore`**: Git ignore file to exclude sensitive files and directories from version control.
- **`package.json`**: Node.js project file containing dependencies and scripts.
- **`README.md`**: This README file.

## License

This project is licensed under the [ISC License](LICENSE).
