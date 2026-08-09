// theme.tokens.js
// Whitelist CSS variable mà 1 theme được phép định nghĩa — hàng rào duy nhất
// chặn theme (kể cả do AI tạo) đụng vào bất cứ thứ gì ngoài màu sắc thuần tuý.

const TOKEN_KEYS = [
  "--bg-primary",
  "--bg-secondary",
  "--bg-elevated",
  "--bg-hover",
  "--text-primary",
  "--text-muted",
  "--accent",
  "--border",
];

const HEX_COLOR_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

module.exports = { TOKEN_KEYS, HEX_COLOR_RE };
