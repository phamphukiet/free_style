// resolve-args.js
// Trách nhiệm duy nhất: thay {{stepResults.N.field}} trong argsTemplate bằng
// giá trị thật lấy từ kết quả step trước — cho step sau dùng output step trước.

function getByPath(obj, pathStr) {
  return pathStr.split(".").reduce((acc, key) => acc?.[key], obj);
}

function resolveValue(value, ctx) {
  if (typeof value !== "string") return value;
  const match = value.match(/^\{\{(.+)\}\}$/);
  if (!match) return value;
  return getByPath(ctx, match[1].trim()) ?? "";
}

function resolveArgs(argsTemplate, run) {
  const ctx = { stepResults: run.stepResults };
  const resolved = {};
  for (const [key, value] of Object.entries(argsTemplate || {})) {
    resolved[key] = resolveValue(value, ctx);
  }
  return resolved;
}

module.exports = { resolveArgs };
