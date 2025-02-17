import { computeChecksum } from "./checksum";
import { Config } from "./config";
import { crockfordDecode } from "./crockford";
import { unbufferReference } from "./reference";
import { unbufferTimestamp } from "./timestamp";

/**
 * Validates and unpacks the transaction ID into a timestamp and reference
 * @param encoded the transaction ID generated from generateTxnId()
 * @returns object { timestamp: number; reference: string; valid: boolean }
 */
export function validateTxnId(encoded: string): {
  timestamp: number;
  reference: string;
  valid: boolean;
} {
  if (encoded.length < 2) return { timestamp: 0, reference: "", valid: false };

  const checksum = encoded.slice(-1);
  const encodedData = encoded.slice(0, -1);
  const expectedChecksum = computeChecksum(encodedData);
  const valid = checksum === expectedChecksum;

  try {
    const buffer = crockfordDecode(encodedData);
    const timestamp = unbufferTimestamp(buffer.slice(0, Config.TIMESTAMP_BYTES));
    const reference = unbufferReference(buffer.slice(Config.TIMESTAMP_BYTES));

    return { timestamp, reference: reference === "null" ? "" : reference, valid };
  } catch (error) {
    return { timestamp: 0, reference: "", valid };
  }
}
