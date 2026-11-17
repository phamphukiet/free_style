// args.js
// Kiểm args của lần gọi theo schema. Từ chối tham số lạ để lỗi gõ sai lộ ra sớm.

const TYPE_CHECKS = {
  string: (v) => typeof v === "string",
  number: (v) => typeof v === "number" && Number.isFinite(v),
  boolean: (v) => typeof v === "boolean",
  object: (v) => v !== null && typeof v === "object" && !Array.isArray(v),
  array: Array.isArray,
};

function typeErrors({ props, args }) {
  return Object.entries(args)
    .filter(([key, value]) => !TYPE_CHECKS[props[key].type](value))
    .map(([key]) => `${key} phải là ${props[key].type}`);
}
function snapshot(args) {
  try {
    return { value: JSON.parse(JSON.stringify(args)) };
  } catch {
    return { error: "args không phải JSON hợp lệ" };
  }
}
/** @returns {string|null} chuỗi lỗi hoặc null nếu hợp lệ */
function validateArgs({ schema, args }) {
  if (!TYPE_CHECKS.object(args)) return "args phải là object";
  const props = schema.properties;
  const allowed = Object.keys(props).join(", ") || "(không có tham số)";

  const unknown = Object.keys(args).filter((k) => !Object.hasOwn(props, k));
  if (unknown.length > 0) {
    return `tham số lạ: ${unknown.join(", ")}. Hợp lệ: ${allowed}`;
  }
  const missing = (schema.required ?? []).filter((k) => args[k] === undefined);
  if (missing.length > 0) return `thiếu tham số: ${missing.join(", ")}`;

  const bad = typeErrors({ props, args });
  return bad.length > 0 ? bad.join("; ") : null;
}

module.exports = { validateArgs, snapshot };
