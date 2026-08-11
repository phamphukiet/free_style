// Whitelist "loại" token được phép override ở cấp component — áp dụng
// chung cho MỌI part, không cần khai riêng từng part (khác theme.tokens.js
// ở chỗ đây không phải danh sách token cụ thể mà là danh sách suffix).
const ALLOWED_SUFFIXES = ["bg", "border", "text", "accent", "hover"];
const SELECTOR_RE = /^[a-z][a-z0-9-]*$/; // kebab-case, khớp tên custom element
const HEX_COLOR_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

module.exports = { ALLOWED_SUFFIXES, SELECTOR_RE, HEX_COLOR_RE };