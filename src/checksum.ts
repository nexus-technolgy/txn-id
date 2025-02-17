import { Constants } from "./constants";

/** Compute a simple checksum (mod 32, so it's 1 character in Crockford Base 32) */
export function computeChecksum(data: string): string {
  let sum = 0;
  for (const char of data) {
    sum += char.charCodeAt(0);
  }
  const checksum = Constants.CROCKFORD[sum % 32];
  return checksum;
}
