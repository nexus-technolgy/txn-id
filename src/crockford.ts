import { Constants } from "./constants";

/** Convert buffer to a Crockford Base 32 string */
export function crockfordEncode(buffer: Uint8Array): string {
  if (buffer.length === 0) {
    return "";
  }
  let bits = 0;
  let value = 0;
  let output = "";

  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;

    while (bits >= 5) {
      output += Constants.CROCKFORD[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += Constants.CROCKFORD[(value << (5 - bits)) & 31];
  }

  return output;
}

/** Convert a Crockford Base 32 string to a Uint8Array */
export function crockfordDecode(encoded: string): Uint8Array {
  let bits = 0;
  let value = 0;
  const output = [];

  for (const char of encoded.toUpperCase()) {
    if (!(char in Constants.CHAR_MAP)) {
      throw new Error(`Invalid character found: ${char}`);
    }
    value = (value << 5) | Constants.CHAR_MAP[char];
    bits += 5;

    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return new Uint8Array(output);
}
