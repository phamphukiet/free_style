// spec.js
// Hằng số hợp đồng manifest, dùng chung cho module (built-in) và extension.
//
// Manifest   = { owner, settings: Definition[], presets?: Preset[] }
// Definition = { id, group, label, type, default, scope?, order?, description?,
//                tags?, min?, max?, aiAccess?, aiHint?, options?, effects? }
// Option     = { value, label, data? }       Preset = Option + { setting }
// Effect     = { target, payload?, via? }
//   payload là biểu thức DỮ LIỆU: "$value" | "$option.data.x" | object/array chứa chúng.
//   via là tên hàm biến đổi đã đăng ký (capability "setting-transform").

module.exports = {
  TYPES: ["boolean", "number", "string", "select"],
  SCOPES: ["global", "any"],
  AI_ACCESS: ["write", "read", "none"],
  ID_PATTERN: /^[a-z][a-z0-9-]*(\.[A-Za-z][A-Za-z0-9-]*)+$/,
  OWNER_PATTERN: /^[a-z][a-z0-9-]*$/,
  EXPR_PATTERN: /^\$(value|option)(\.[A-Za-z0-9_-]+)*$/,
  MAX_DATA_BYTES: 8 * 1024,
};
