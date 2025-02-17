import { bufferTimestamp, unbufferTimestamp } from "../timestamp";

describe("timestamp encoding/decoding", () => {
  test("encodes and decodes zero timestamp", () => {
    const timestamp = 0;
    const encoded = bufferTimestamp(timestamp);
    const decoded = unbufferTimestamp(encoded);
    expect(decoded).toBe(timestamp);
  });

  test("encodes and decodes current timestamp", () => {
    const timestamp = Date.now();
    const encoded = bufferTimestamp(timestamp);
    const decoded = unbufferTimestamp(encoded);
    expect(decoded).toBe(timestamp);
  });

  test("encodes and decodes max 48-bit timestamp", () => {
    const timestamp = Math.pow(2, 48) - 1;
    const encoded = bufferTimestamp(timestamp);
    const decoded = unbufferTimestamp(encoded);
    expect(decoded).toBe(timestamp);
  });

  test("encoded timestamp has correct byte length", () => {
    const timestamp = Date.now();
    const encoded = bufferTimestamp(timestamp);
    expect(encoded.length).toBe(6);
  });

  test("handles large timestamps", () => {
    const timestamp = 1234567890123;
    const encoded = bufferTimestamp(timestamp);
    const decoded = unbufferTimestamp(encoded);
    expect(decoded).toBe(timestamp);
  });

  test("maintains byte order", () => {
    const timestamp = 1000000;
    const encoded = bufferTimestamp(timestamp);
    expect(encoded[0]).toBe(0);
    expect(encoded[1]).toBe(0);
    const decoded = unbufferTimestamp(encoded);
    expect(decoded).toBe(timestamp);
  });
});
