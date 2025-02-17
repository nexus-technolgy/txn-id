import { crockfordDecode } from "../crockford";
import { generateTxnId } from "../generateTxnId";

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

  test("generates valid checksum", () => {
    const result = generateTxnId();
    const checksum = result.slice(-1);
    expect(checksum).toMatch(/^[0-9A-Z]$/);
  });

  test("generates IDs that can be decoded", () => {
    const result = generateTxnId();
    expect(() => {
      const withoutChecksum = result.slice(0, -1);
      crockfordDecode(withoutChecksum, 8);
    }).not.toThrow();
  });
});
