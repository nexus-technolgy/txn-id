const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ".split("");
const CHAR_MAP: Record<string, number> = Object.fromEntries(
  CROCKFORD.map((char, index) => [char, index])
);
const COMPRESSED_FLAG = 0x80;
const UUID_BUFFER_LENGTH = 16;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-57][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const Constants = {
  CROCKFORD,
  CHAR_MAP,
  COMPRESSED_FLAG,
  UUID_BUFFER_LENGTH,
  UUID_REGEX,
};
