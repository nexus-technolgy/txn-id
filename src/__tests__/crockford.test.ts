import { crockfordDecode, crockfordEncode } from "../crockford";

describe("crockford", () => {
  describe("crockfordEncode", () => {
    test("encodes empty buffer", () => {
      const result = crockfordEncode(new Uint8Array([]));
      expect(result).toBe("");
    });

    test("encodes single byte", () => {
      const result = crockfordEncode(new Uint8Array([255]));
      expect(result).toMatch(/^[0-9A-Z]+$/);
      expect(result.length).toBe(2);
    });

    test("encodes multiple bytes", () => {
      const result = crockfordEncode(new Uint8Array([1, 2, 3, 4]));
      expect(result).toMatch(/^[0-9A-Z]+$/);
      expect(result.length).toBe(7);
    });

    test("handles zero bytes", () => {
      const result = crockfordEncode(new Uint8Array([0, 0]));
      expect(result).toMatch(/^0+$/);
      expect(result.length).toBe(4);
    });
  });

  describe("crockfordDecode", () => {
    test("decodes empty string", () => {
      const result = crockfordDecode("", 0);
      expect(result.length).toBe(0);
    });

    test("decodes to expected length", () => {
      const result = crockfordDecode("ZZ", 1);
      expect(result.length).toBe(1);
    });

    test("handles lowercase input", () => {
      const original = new Uint8Array([1, 2, 3]);
      const encoded = crockfordEncode(original);
      const decoded = crockfordDecode(encoded.toLowerCase(), 3);
      expect(decoded).toEqual(original);
    });

    test("roundtrip encoding and decoding", () => {
      const original = new Uint8Array([255, 128, 64, 32, 16]);
      const encoded = crockfordEncode(original);
      const decoded = crockfordDecode(encoded, 5);
      expect(decoded).toEqual(original);
    });

    test("pads output to expected length", () => {
      const result = crockfordDecode("1", 2);
      expect(result.length).toBe(2);
      expect(result[0]).toBe(0);
    });
  });
});
