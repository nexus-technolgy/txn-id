import { computeChecksum } from "../checksum";

describe("computeChecksum", () => {
  test("computes checksum for empty string", () => {
    const result = computeChecksum("");
    expect(result).toMatch(/^[0-9A-Z]$/);
    expect(result.length).toBe(1);
  });

  test("computes consistent checksum for same input", () => {
    const input = "test123";
    const result1 = computeChecksum(input);
    const result2 = computeChecksum(input);
    expect(result1).toBe(result2);
  });

  test("handles special characters", () => {
    const result = computeChecksum("!@#$%^&*");
    expect(result).toMatch(/^[0-9A-Z]$/);
    expect(result.length).toBe(1);
  });

  test("handles unicode characters", () => {
    const result = computeChecksum("Hello 世界");
    expect(result).toMatch(/^[0-9A-Z]$/);
    expect(result.length).toBe(1);
  });

  test("produces different checksums for different inputs", () => {
    const result1 = computeChecksum("abc");
    const result2 = computeChecksum("def");
    expect(result1).not.toBe(result2);
  });

  test("handles long strings", () => {
    const longString = "A".repeat(1000);
    const result = computeChecksum(longString);
    expect(result).toMatch(/^[0-9A-Z]$/);
    expect(result.length).toBe(1);
  });
});
