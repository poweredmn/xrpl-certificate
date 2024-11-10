all:
	wasmcc certificate.c -o certificate.wasm -O0 -Wl,--allow-undefined -I../

