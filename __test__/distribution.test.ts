import { v4 } from "uuid";

import { generateTxnId, validateTxnId } from "../dist";

describe("Distribution Test", () => {
  const now = Date.now();
  if (!generateTxnId || !validateTxnId) {
    throw new Error("package has not been built");
  }
  it("should generate a valid transaction ID", () => {
    const txnId = generateTxnId();
    const result = validateTxnId(txnId);

    console.log({ txnId, result });

    expect(result.valid).toBe(true);
    expect(result.timestamp).toBeCloseTo(now, -4);
    expect(result.reference).toMatch(/\w{8}/);
  });

  it("should generate a valid transaction ID with default timestamp", () => {
    const reference = "INV123456";
    const txnId = generateTxnId(reference);
    const result = validateTxnId(txnId);

    console.log({ reference, txnId, result });

    expect(result.valid).toBe(true);
    expect(result.timestamp).toBeCloseTo(now, -4);
    expect(result.reference).toBe(reference);
  });

  it("should generate a valid transaction ID with UUID reference", () => {
    const reference = v4();
    const txnId = generateTxnId(reference, now);
    const result = validateTxnId(txnId);

    console.log({ reference, txnId, result });

    expect(result.valid).toBe(true);
    expect(result.timestamp).toBeCloseTo(now, -4);
    expect(result.reference).toBe(reference);
  });

  it("should generate a valid transaction ID with long, compressible reference", () => {
    const reference = "000000000000000000000123456";
    const txnId = generateTxnId(reference);
    const result = validateTxnId(txnId);

    console.log({ reference, txnId, result });

    expect(result.valid).toBe(true);
    expect(result.timestamp).toBeCloseTo(now, -4);
    expect(result.reference).toBe(reference);
  });

  it("should generate a valid transaction ID for past timestamp", () => {
    const reference = "INV12345";
    const timestamp = now - 1625000000000;
    const txnId = generateTxnId(reference, timestamp);
    const result = validateTxnId(txnId);

    console.log({ reference, txnId, result });

    expect(result.valid).toBe(true);
    expect(result.timestamp).toBe(timestamp);
    expect(result.reference).toBe(reference);
  });

  it("should reject invalid transaction ID", () => {
    const invalidTxnId = "INVALID";
    const result = validateTxnId(invalidTxnId);

    console.log({ invalidTxnId, result });

    expect(result.valid).toBe(false);
    expect(result.timestamp).toBe(0);
    expect(result.reference).toBe("");
  });

  it("should return an invalid result when checksum is invalid", () => {
    const reference = "INV123456";
    const txnId = generateTxnId(reference);
    const modifiedTxnId = txnId.slice(0, -1) + "O";
    const result = validateTxnId(modifiedTxnId);

    console.log({ txnId, result });

    expect(result.valid).toBe(false);
    expect(result.timestamp).toBeCloseTo(now, -4);
    expect(result.reference).toBe(reference);
  });
});
