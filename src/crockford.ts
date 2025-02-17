import { Constants } from "./constants";

/** Convert buffer to a Crockford Base 32 string */
export function crockfordEncode(buffer: Uint8Array): string {
  if (buffer.length === 0) {
    return "";
  }

  let value = BigInt("0x" + Buffer.from(buffer).toString("hex"));
  let encoded = "";

  while (value > 0) {
    encoded = Constants.CROCKFORD[Number(value % 32n)] + encoded;
    value /= 32n;
  }

  return encoded.padStart(Math.ceil((buffer.length * 8) / 5), "0");
}

/** Convert a Crockford Base 32 string to a Uint8Array */
export function crockfordDecode(encoded: string, expectedLength: number): Uint8Array {
  let value = 0n;

  for (const char of encoded.toUpperCase()) {
    value = value * 32n + BigInt(Constants.CHAR_MAP[char]);
  }

  const hex = value.toString(16).padStart(expectedLength * 2, "0");
  return new Uint8Array(Buffer.from(hex, "hex"));
}
