import { Config } from "../config";
import { Constants } from "../constants";
import { crockfordDecode } from "../crockford";
import { generateTxnId } from "../generateTxnId";
import { validateTxnId } from "../validateTxnId";

describe("generateTxnId", () => {
  test("generates a string with expected format", () => {
    const result = generateTxnId();
    expect(result).toMatch(/^[0-9A-Z]+$/);
  });

  test("generates unique IDs", () => {
    const id1 = generateTxnId();
    const id2 = generateTxnId();
    expect(id1).not.toBe(id2);
  });

  test("generates ID with consistent length", () => {
    const results = Array.from({ length: 100 }, () => generateTxnId());
    const firstLength = results[0].length;
    results.forEach((result) => {
      expect(result.length).toBe(firstLength);
    });
  });

  test("generates IDs with consistent increasing timestamp", () => {
    const variance = 3600000 * 24 * 7;
    const past = Date.now() - variance * 100;
    const results = Array.from({ length: 100 }, (_, i) => {
      const pastTime = past + i * variance;
      return generateTxnId(undefined, pastTime);
    });

    let lastTimestamp = past - variance;
    results.forEach((result) => {
      const { timestamp } = validateTxnId(result);
      expect(timestamp).toBeCloseTo(lastTimestamp + variance, -2);
      lastTimestamp = timestamp;
    });
  });

  test("generates valid checksum", () => {
    const result = generateTxnId();
    const checksum = result.slice(-1);
    expect(checksum).toMatch(/^[0-9A-Z]$/);
  });

  test("generates IDs that can be decoded", () => {
    const result = generateTxnId();
    expect(() => {
      const withoutChecksum = result.slice(0, -1);
      crockfordDecode(withoutChecksum);
    }).not.toThrow();
  });

  test("generates IDs with consistent length once compression threshold is reached for reference length", () => {
    const referenceOf = (length: number) =>
      Array.from({ length }, (_, i) => Constants.CROCKFORD[i]).join("");
    let reference = referenceOf(6);
    while (reference.length < Constants.CROCKFORD.length) {
      const txnId = generateTxnId(reference);
      expect(txnId.length).toBeLessThanOrEqual(Config.MAX_ENCODED_LENGTH + Config.CHECKSUM_BYTES);
      reference = referenceOf(reference.length + 1);
    }
  });

  test("validate README.md", () => {
    const reference = "Order12345";
    const timestamp = new Date("2025-02-17T12:34:56.789Z").getTime();
    const result = generateTxnId(reference, timestamp);
    expect(result).toBe("06AH7SWCJM04YWK4CNS32CHK6GTGM");
  });
});
