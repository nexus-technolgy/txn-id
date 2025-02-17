# txn-id

`txn-id` is a Node.js library designed to generate and validate unique transaction IDs. Each ID comprises a 6-byte timestamp prefix, a compressed reference string, and a checksum character, all encoded using Crockford's Base32 encoding. This structure ensures compact, human-readable, and URL-safe transaction identifiers.

Identifers are prefixed with a Crockford Base32 48-bit timestamp (in milliseconds) enabling efficient sorting of transactions IDs, with exhaustion of the timestamp occurring in approximately 9,000 years.

Reference strings that are longer than 16 bytes (10 characters) are compressed using the [zlib](https://nodejs.org/api/zlib.html) module if compressible (e.g. many repeated zeros), while UUID references are processed as `hex` and efficiently stored within the generated identifier. Very long strings are truncated, but the Configuration can be modified to allow for longer strings if desired.

## Features

- **Generate Transaction IDs**: Create unique IDs with embedded timestamps and compressed reference strings.
- **Validate Transaction IDs**: Verify the integrity of transaction IDs and extract their components.
- **Dependency-Free**: Utilizes Node.js's built-in zlib module for compression, eliminating external dependencies.

## Installation

Since `txn-id` is designed to be dependency-free, you can import functions directly into your project.

## Usage

### Generating a Transaction ID

The `generateTxnId` function creates a transaction ID from a given reference string.

```ts
import { generateTxnId } from ("txn-id");

// Example reference string
const reference = "Order12345";

// Generate transaction ID
const txnId = generateTxnId(reference);
console.log(txnId); // '06AH7SWCJM04YWK4CNS32CHK6GTGM'
```

### Validating a Transaction ID

The validateTxnId function checks the integrity of a transaction ID and extracts its components.

```ts
import { validateTxnId } from "txn-id";

// Example transaction ID
const txnId = "06AH7SWCJM04YWK4CNS32CHK6GTGM";

// Validate transaction ID
const result = validateTxnId(txnId);

if (result.valid) {
  console.log("Timestamp:", new Date(result.timestamp).toISOString()); // '2025-02-17T12:34:56.789Z'
  console.log("Reference:", result.reference); // 'Order12345'
} else {
  console.log("Invalid transaction ID");
}
```

## API

### `generateTxnId(reference)`

- **Parameters**:
  - `reference` (string): The reference string to include in the transaction ID.
- **Returns**: A string representing the generated transaction ID.
  NB: an identical timestamp and identical reference will produce an identical transaction ID. This is by design to prevent duplicate transactions being made on financial exchanges as each transaction should be unique.

### `validateTxnId(txnId)`

- **Parameters**:
  - `txnId` (string): The transaction ID to validate.
- **Returns**: An object with the following properties:
  - `valid` (boolean): Indicates whether the transaction ID is valid.
  - `timestamp` (number): The extracted timestamp as a Unix timestamp in milliseconds.
  - `reference` (string): The decompressed reference string.

## License

This project is licensed under the Apache v2 License.

## Contributing

Contributions to `txn-id` are always welcom to improve how systems generate compact, unique, and human-readable transaction identifiers without relying on external dependencies.

## Development

To install dependencies:

```bash
bun install
```

To test:

```bash
bun test
```
