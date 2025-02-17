import { v4 } from "uuid";

import { Constants } from "../constants";
import { bufferReference, unbufferReference } from "../reference";

describe("bufferReference", () => {
  test("handles empty reference", () => {
    const result = bufferReference("");
    expect(result).toEqual(new Uint8Array());
  });

  test("handles null reference", () => {
    const result = bufferReference(null as unknown as string);
    expect(result).toEqual(new Uint8Array());
  });

  test("converts UUID format correctly", () => {
    const uuid = v4();
    const result = bufferReference(uuid);
    expect(result.length).toBe(Constants.UUID_BUFFER_LENGTH);
    expect(Buffer.from(result).toString("hex")).toBe(uuid.replace(/-/g, ""));
  });

  test("handles regular string input", () => {
    const str = "INV12345";
    const result = bufferReference(str);
    expect(Buffer.from(result.slice(1)).toString()).toBe(str);
  });

  test("truncates long strings to max length", () => {
    const longString = "a".repeat(1000);
    const result = bufferReference(longString);
    expect(result.length).toBeLessThan(1000);
  });
});

describe("unbufferReference", () => {
  test("throws on null input", () => {
    expect(() => unbufferReference(null as unknown as Uint8Array)).toThrow("Invalid buffer input");
  });

  test("throws on invalid input type", () => {
    expect(() => unbufferReference([] as unknown as Uint8Array)).toThrow("Invalid buffer input");
  });

  test("converts non-UUID buffer to string", () => {
    const buffer = new Uint8Array(Buffer.from(" Test String", "utf-8"));
    const result = unbufferReference(buffer);
    expect(result).toBe("Test String");
  });

  test("handles empty buffer", () => {
    const buffer = new Uint8Array();
    const result = unbufferReference(buffer);
    expect(result).toBe("");
  });

  test("converts valid UUID buffer back to UUID format", () => {
    const uuid = v4();
    const uuidBuffer = new Uint8Array(Buffer.from(uuid.replace(/-/g, ""), "hex"));
    const result = unbufferReference(uuidBuffer);
    expect(result).toBe(uuid);
  });

  test("falls back to UTF-8 for invalid UUID pattern", () => {
    const invalidUuidBuffer = new Uint8Array(16).fill(0xff);
    const result = unbufferReference(invalidUuidBuffer);
    expect(result).not.toMatch(/-/);
  });
});

describe("Reference with zlib compression", () => {
  test("short strings remain uncompressed", () => {
    const shortRef = "abc123";
    const buffer = bufferReference(shortRef);
    const result = unbufferReference(buffer);
    expect(result).toBe(shortRef);
  });

  test("long strings get compressed", () => {
    const longRef = "a".repeat(100);
    const buffer = bufferReference(longRef);

    // Compressed buffer should be smaller than input
    expect(buffer.length).toBeLessThan(longRef.length);

    const result = unbufferReference(buffer);
    expect(result).toBe(longRef);
  });

  test("handles repeated patterns efficiently", () => {
    const repeatedRef = "test ".repeat(20);
    const buffer = bufferReference(repeatedRef);

    // Verify compression ratio
    expect(buffer.length).toBeLessThan(repeatedRef.length * 0.5);

    const result = unbufferReference(buffer);
    expect(result).toBe(repeatedRef);
  });

  test("preserves unicode characters after compression", () => {
    const unicodeRef = "🚀".repeat(5) + "🌍".repeat(5);
    const buffer = bufferReference(unicodeRef);
    const result = unbufferReference(buffer);
    expect(result).toBe(unicodeRef);
  });
});
