const MAX_ENCODED_LENGTH = 40;
const TIMESTAMP_BYTES = 6; // 48 bit ~ 9000 years to millisecond precision
const CHECKSUM_BYTES = 1;
const COMPRESSION_LEVEL = 8; // 1-9, zlib default is 6
const COMPRESSION_THRESHOLD = 14; // maximum is 16

export const Config = {
  MAX_ENCODED_LENGTH,
  TIMESTAMP_BYTES,
  CHECKSUM_BYTES,
  COMPRESSION_LEVEL,
  COMPRESSION_THRESHOLD,
};
