import { deflateSync, inflateSync } from "zlib";

import { Config } from "./config";
import { Constants } from "./constants";

export function bufferReference(reference: string): Uint8Array {
  if (!reference) {
    return new Uint8Array();
  }

  // Handle UUIDs directly
  if (Constants.UUID_REGEX.test(reference)) {
    return new Uint8Array(Buffer.from(reference.replace(/-/g, ""), "hex"));
  }

  const maxStringBytes =
    Math.floor(((Config.MAX_ENCODED_LENGTH - Config.CHECKSUM_BYTES) * 5) / 8) -
    Config.TIMESTAMP_BYTES;
  const dataBytes = Buffer.from(reference, "utf-8");
  let result: Buffer;

  // Only compress if beneficial
  if (dataBytes.length < Config.COMPRESSION_THRESHOLD) {
    result = Buffer.alloc(dataBytes.length + 1);
    result[0] = 0;
    dataBytes.copy(result, 1);
  } else {
    let compressed = Buffer.from(
      deflateSync(reference, {
        level: Config.COMPRESSION_LEVEL,
      })
    );
    let i = 0;
    while (compressed.length > maxStringBytes && i++ <= dataBytes.length) {
      compressed = Buffer.from(
        deflateSync(reference.slice(0, -i), {
          level: Config.COMPRESSION_LEVEL,
        })
      );
    }
    console.log("compressed length", compressed.length);
    result = Buffer.alloc(compressed.length + 1);
    result[0] = Constants.COMPRESSED_FLAG;
    compressed.copy(result, 1);
  }
  return new Uint8Array(result);
}

export function unbufferReference(buffer: Uint8Array): string {
  if (!buffer || !(buffer instanceof Uint8Array)) {
    throw new Error("Invalid buffer input");
  }

  const bufferInstance = Buffer.from(buffer);

  // Handle UUID case
  if (buffer.length === Constants.UUID_BUFFER_LENGTH) {
    const uuid = [
      bufferInstance.toString("hex", 0, 4),
      bufferInstance.toString("hex", 4, 6),
      bufferInstance.toString("hex", 6, 8),
      bufferInstance.toString("hex", 8, 10),
      bufferInstance.toString("hex", 10, 16),
    ].join("-");
    if (Constants.UUID_REGEX.test(uuid)) {
      return uuid;
    }
  }

  const isCompressed = (buffer[0] & Constants.COMPRESSED_FLAG) === Constants.COMPRESSED_FLAG;
  const data = new Uint8Array(bufferInstance).slice(1);

  // Try to decompress, fall back to raw if it fails
  try {
    if (!isCompressed) throw new Error("not compressed");
    return Buffer.from(inflateSync(data)).toString("utf-8");
  } catch {
    return Buffer.from(data).toString("utf-8");
  }
}
