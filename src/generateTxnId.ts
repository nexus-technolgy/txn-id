import { computeChecksum } from "./checksum";
import { crockfordEncode } from "./crockford";
import { bufferReference } from "./reference";
import { bufferTimestamp } from "./timestamp";

/**
 * Encode a reference in to a timestamped transaction ID with checksum
 * @param reference (optional) The reference for the transaction such as the order number or invoice number.
 * Do not use sensitive data such as credit card numbers or email addresses.
 * Truncates if too long. Random PNR is used if not provided.
 * @param timestamp (optional) the Unix epoch value for the timestamp, otherwise now()
 * @returns Crockford Base 32 string
 *
 */
export function generateTxnId(reference?: string, timestamp = Date.now()): string {
  const data =
    reference ??
    (reference === null
      ? "null"
      : Math.random().toString(36).substring(2, 10).replace(/\W/g, "").padEnd(8, "0"));
  const tsBytes = bufferTimestamp(timestamp);
  const dataBytes = bufferReference(data);
  const combined = new Uint8Array([...tsBytes, ...dataBytes]);
  const encoded = crockfordEncode(combined);

  const checksum = computeChecksum(encoded);
  return encoded + checksum;
}
