// normalize.js
// Đưa lệnh về dạng chuẩn: gắn id, mặc định aiAccess="none", đổi args dạng cũ
// { bg: "string" } thành JSON Schema (mọi khoá bắt buộc).

const isPlain = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

const EMPTY_SCHEMA = Object.freeze({ type: "object", properties: {} });

function toSchema(args) {
  if (args === undefined) return EMPTY_SCHEMA;
  if (!isPlain(args)) return args; // validate sẽ báo lỗi
  if (args.type === "object" && isPlain(args.properties)) return args; // dạng đầy đủ
  const keys = Object.keys(args);
  return {
    type: "object",
    properties: Object.fromEntries(keys.map((k) => [k, { type: args[k] }])),
    required: keys,
  };
}

function normalizeCommand({ moduleId, name, def }) {
  const base = isPlain(def) ? def : {};
  return {
    ...base,
    id: `${moduleId}.${name}`,
    module: moduleId,
    name,
    aiAccess: base.aiAccess ?? "none",
    args: toSchema(base.args),
  };
}

function normalizeFile({ moduleId, exports }) {
  if (!isPlain(exports)) {
    throw new Error("file phải export object { tên: định nghĩa }");
  }
  return Object.entries(exports).map(([name, def]) =>
    normalizeCommand({ moduleId, name, def }),
  );
}

module.exports = { normalizeFile };
