// args.js
// Kiểm tra tham số lệnh theo ArgSpec { type, many?, optional?, entity? }.
// Vẫn nhận dạng cũ { tênArg: "string" } để lệnh hiện có không phải sửa.

const toSpec = (spec) => (typeof spec === "string" ? { type: spec } : spec);

const toSchema = (args = {}) =>
  Object.fromEntries(Object.entries(args).map(([k, s]) => [k, toSpec(s)]));

function valueError({ spec, value }) {
  if (!spec.many) {
    return typeof value === spec.type ? null : `phải là ${spec.type}`;
  }
  const ok =
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((v) => typeof v === spec.type);
  return ok ? null : `phải là mảng ${spec.type} không rỗng`;
}

function argsError({ schema = {}, args }) {
  if (args === null || typeof args !== "object") return "args phải là object";
  const specs = toSchema(schema);
  const extra = Object.keys(args).find((key) => !Object.hasOwn(specs, key));
  if (extra) return `không có tham số "${extra}"`;
  for (const [key, spec] of Object.entries(specs)) {
    if (args[key] === undefined && spec.optional) continue;
    const error = valueError({ spec, value: args[key] });
    if (error) return `tham số "${key}" ${error}`;
  }
  return null;
}

module.exports = { toSchema, argsError };
