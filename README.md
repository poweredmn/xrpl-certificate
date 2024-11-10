## Prerequisites

- Node.js
- MongoDB
- RippleAPI (xrpl.js)
- wasmcc (WebAssembly compiler)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/certificate-verification.git
   cd certificate-verification
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Set up the environment variables in a `.env` file:
   ```sh
   SOURCE_SECRET=<Your Ripple Wallet Secret>
   MONGO_URI=<Your MongoDB URI>
   ```

## Usage

1. Start the server:

   ```sh
   npm start
   ```

2. Upload a file to store its hash on the blockchain:

   ```sh
   curl -F "file=@path/to/your/file" http://localhost:3000/upload-file
   ```

3. Check if a file's hash exists on the blockchain:
   ```sh
   curl -F "file=@path/to/your/file" http://localhost:3000/check-hash
   ```

## Project Files

- `server.js`: The main server file that handles file uploads and hash verification.
- `certificate.c`: Contains the hook logic for interacting with the XRPL blockchain.
- `hookapi.h`: Header file for the hook API functions.
- `hookmacro.h`: Header file for helper macros used in the hook logic.
- `sfcodes.h`: Header file containing field codes for XRPL transactions.
- `makefile`: Makefile for compiling the WebAssembly module.
- `.env`: Environment variables file (not included in the repository).
- `.gitignore`: Git ignore file to exclude certain files and directories from version control.
- `package.json`: Node.js project file containing dependencies and scripts.
- `README.md`: This README file.

## License

This project is licensed under the ISC License.
