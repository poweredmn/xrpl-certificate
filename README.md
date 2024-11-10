## Prerequisites

- **Node.js** (version X.X.X or later)
- **MongoDB**
- **RippleAPI** (`xrpl.js` library)
- **wasmcc** (WebAssembly compiler)

## System Design Diagrams

1. **High-Level System Design Diagram**

   ```mermaid
      graph TD
         subgraph Client Layer
            A[Web Client]
         end

         subgraph Application Layer
            B[Express Server]
            C[File Handler]
            D[Hash Generator]
            E[WebAssembly Module]
            F[XRPL Client]
         end

         subgraph Storage Layer
            G[(MongoDB)]
            H[XRPL Blockchain]
         end

         A -->|Upload File| B
         B -->|Process File| C
         C -->|Generate Hash| D
         D -->|Store Hash| G
         D -->|Pass to Hook| E
         E -->|Submit Tx| F
         F -->|Write State| H
         H -->|Query State| F
         F -->|Verify Hash| E
         E -->|Result| B
   ```

2. **Sequence Diagram**

   ```mermaid
      sequenceDiagram
         participant U as User
         participant S as Server
         participant M as MongoDB
         participant W as WebAssembly
         participant X as XRPL

         %% File Upload Flow
         U->>S: Upload File
         S->>S: Calculate SHA-256
         S->>M: Store Hash
         S->>W: Prepare Transaction
         W->>X: Submit Transaction
         X-->>S: Confirm Transaction
         S-->>U: Upload Complete

         %% Hash Verification Flow
         U->>S: Verify File
         S->>S: Calculate SHA-256
         S->>X: Query State
         X-->>S: Return State
         S-->>U: Verification Result
   ```

3. **Component Diagram**

   ```mermaid
      graph TD
         subgraph Development
            A[Source Code]
            B[WebAssembly Compiler]
            C[Hook Builder]
         end

         subgraph Production
            D[Node.js Server]
            E[MongoDB Instance]
            F[XRPL Node]
         end

         subgraph Client
            G[Web Browser]
         end

         A -->|Compile| B
         B -->|Deploy| C
         C -->|Install| F
         G -->|HTTP| D
         D -->|Query| E
         D -->|RPC| F
   ```

4. **Data Flow Diagram**

   ```mermaid
      graph LR
         subgraph Data Flow
            A[File Upload] -->|SHA-256| B[Hash Generation]
            B -->|Store| C[MongoDB]
            B -->|Encode| D[WebAssembly]
            D -->|Transaction| E[XRPL]
            F[File Verify] -->|SHA-256| G[Hash Check]
            G -->|Query| E
            E -->|State| G
            G -->|Result| H[Response]
      end
   ```

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
4. **Configure your .env file** with the hook account's seed (for deployment):

```bash
MONGO_URI=<Your MongoDB URI>
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

## Technical Design

### Overview

The project consists of a Node.js server that handles file uploads and hash verification, and a WebAssembly module written in C that interacts with the XRPL blockchain.

### Components

- **Node.js Server**: Handles HTTP requests for file uploads and hash verification.

  - **Express**: Web framework used for handling routes and middleware.
  - **Multer**: Middleware for handling file uploads.
  - **MongoDB**: Database for storing file hashes.
  - **XRPL.js**: Library for interacting with the XRPL blockchain.

- **WebAssembly Module**: Contains the hook logic for interacting with the XRPL blockchain.
  - **C Code**: Implements the hook logic.
  - **Hook API**: Provides functions for interacting with the XRPL blockchain.
  - **Helper Macros**: Simplify common tasks in the hook logic.

### Workflow

1. **File Upload**:

   - The user uploads a file via the `/upload-file` endpoint.
   - The server calculates the SHA-256 hash of the file and stores it in MongoDB.
   - A payment transaction is created and signed, including the hash as a memo.
   - The transaction is submitted to the XRPL blockchain.

2. **Hash Verification**:
   - The user uploads a file via the `/check-hash` endpoint.
   - The server calculates the SHA-256 hash of the file.
   - The server queries the XRPL blockchain to check if the hash exists in the hook's state.

### Error Handling

- The server logs errors and returns appropriate HTTP status codes and messages.
- The WebAssembly module uses the rollback function to handle errors and revert state changes.

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
