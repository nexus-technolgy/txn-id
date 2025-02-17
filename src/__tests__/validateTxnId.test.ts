import { generateTxnId } from "../generateTxnId";
import { validateTxnId } from "../validateTxnId";

describe("validateTxnId", () => {
  test("returns invalid result for empty string", () => {
    const result = validateTxnId("");
    expect(result.valid).toBe(false);
    expect(result.timestamp).toBe(0);
    expect(result.reference).toBe("");
  });

  test("returns invalid result for single character", () => {
    const result = validateTxnId("A");
    expect(result.valid).toBe(false);
    expect(result.timestamp).toBe(0);
    expect(result.reference).toBe("");
  });

  test("validates properly generated transaction ID", () => {
    const timestamp = Date.now();
    const reference = "TEST123";
    const txnId = generateTxnId(reference, timestamp);

    const result = validateTxnId(txnId);
    expect(result.valid).toBe(true);
    expect(result.timestamp).toBe(timestamp);
    expect(result.reference).toBe(reference);
  });

  test("returns invalid for modified checksum", () => {
    const txnId = generateTxnId("REF", Date.now());
    const modifiedTxnId = txnId.slice(0, -1) + "X";

    const result = validateTxnId(modifiedTxnId);
    expect(result.valid).toBe(false);
  });

  test("handles maximum timestamp value", () => {
    const maxTimestamp = 2 ** 48 - 1; // Maximum 48-bit timestamp
    const txnId = generateTxnId("MAX", maxTimestamp);

    const result = validateTxnId(txnId);
    expect(result.valid).toBe(true);
    expect(result.timestamp).toBe(maxTimestamp);
    expect(result.reference).toBe("MAX");
  });

  test("handles minimum timestamp value", () => {
    const minTimestamp = 0;
    const txnId = generateTxnId("MIN", minTimestamp);

    const result = validateTxnId(txnId);
    expect(result.valid).toBe(true);
    expect(result.timestamp).toBe(minTimestamp);
    expect(result.reference).toBe("MIN");
  });

  test("handles empty reference", () => {
    const txnId = generateTxnId("", Date.now());

    const result = validateTxnId(txnId);
    expect(result.valid).toBe(true);
    expect(result.reference).toBe("");
  });
});
