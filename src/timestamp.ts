import { Config } from "./config";

// Encode a timestamp into a fixed-length byte array
export function bufferTimestamp(timestamp: number): Uint8Array {
  const tsBytes = new Uint8Array(Config.TIMESTAMP_BYTES);
  const view = new DataView(tsBytes.buffer);

  view.setUint16(0, Math.floor(timestamp / 2 ** 32), false); // Most significant 2 bytes
  view.setUint32(2, timestamp & 0xffffffff, false); // Least significant 4 bytes

  return tsBytes;
}

// Decode a fixed-length byte array into a timestamp
export function unbufferTimestamp(buffer: Uint8Array): number {
  const view = new DataView(buffer.buffer);

  const high = view.getUint16(0, false); // Most significant 2 bytes
  const low = view.getUint32(2, false); // Least significant 4 bytes

  return high * 2 ** 32 + low;
}
