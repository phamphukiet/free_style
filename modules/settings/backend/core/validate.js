// validate.js
// Kiểm tra definition (lúc đăng ký) và giá trị (lúc ghi/đọc). Trả null = hợp lệ.

const {
  TYPES,
  SCOPES,
  AI_ACCESS,
  ID_PATTERN,
  MAX_DATA_BYTES,
} = require("../manifest/spec");

const isText = (v) => typeof v === "string" && v.trim() !== "";
const isNum = (v) => typeof v === "number" && Number.isFinite(v);
const VALUE_CHECKS = {
  boolean: ({ value }) =>
    typeof value === "boolean" ? null : "phải là boolean",
  string: ({ value }) => (typeof value === "string" ? null : "phải là chuỗi"),
  number: ({ def, value }) => {
    if (!isNum(value)) return "phải là số";
    if (def.min !== undefined && value < def.min) return `nhỏ hơn ${def.min}`;
    if (def.max !== undefined && value > def.max) return `lớn hơn ${def.max}`;
    return null;
  },
  select: ({ def, value }) =>
    (def.options || []).some((o) => o.value === value)
      ? null
      : "không nằm trong options",
};

function validateValue({ def, value }) {
  const check = VALUE_CHECKS[def.type];
  return check ? check({ def, value }) : `type "${def.type}" không hợp lệ`;
}

function validateOption({ option }) {
  if (!option || !isText(option.value) || !isText(option.label)) {
    return "option cần value và label dạng chuỗi";
  }
  if (option.data === undefined) return null;
  const isObject = typeof option.data === "object" && option.data !== null;
  const tooBig = JSON.stringify(option.data ?? null).length > MAX_DATA_BYTES;
  return isObject && !tooBig ? null : "option.data phải là object, ≤ 8KB";
}

function optionsRule({ def }) {
  if (def.type !== "select") {
    return def.options === undefined ? null : "chỉ type select mới có options";
  }
  const list = def.options;
  if (!Array.isArray(list) || list.length === 0) return "select cần options";
  const bad = list.map((option) => validateOption({ option })).find(Boolean);
  if (bad) return bad;
  const values = list.map((o) => o.value);
  return new Set(values).size === values.length ? null : "options trùng value";
}

function defaultRule({ def }) {
  const error = validateValue({ def, value: def.default });
  return error ? `default ${error}` : null;
}

function effectsRule({ def }) {
  if (def.effects === undefined) return null;
  if (!Array.isArray(def.effects)) return "effects phải là mảng";
  const ok = def.effects.every(
    (e) => e && isText(e.target) && (e.via === undefined || isText(e.via)),
  );
  return ok ? null : "effect cần target (và via nếu có) dạng chuỗi";
}

const RULES = [
  ({ def }) => (ID_PATTERN.test(def.id) ? null : "id sai định dạng owner.key"),
  ({ def, owner }) =>
    def.id.startsWith(`${owner}.`) ? null : `id phải bắt đầu bằng "${owner}."`,
  ({ def }) =>
    isText(def.group) && isText(def.label) ? null : "thiếu group/label",
  ({ def }) => (TYPES.includes(def.type) ? null : "type không hợp lệ"),
  ({ def }) =>
    def.scope === undefined || SCOPES.includes(def.scope)
      ? null
      : "scope không hợp lệ",
  ({ def }) =>
    def.aiAccess === undefined || AI_ACCESS.includes(def.aiAccess)
      ? null
      : "aiAccess không hợp lệ",
  optionsRule,
  defaultRule,
  effectsRule,
];

function validateDefinition({ def, owner }) {
  if (!def || typeof def !== "object") return "definition phải là object";
  for (const rule of RULES) {
    const error = rule({ def, owner });
    if (error) return `${def.id}: ${error}`;
  }
  return null;
}

module.exports = { validateDefinition, validateValue, validateOption };