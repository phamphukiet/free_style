// wrappers.js — bọc hàm gốc bằng các wrapper đăng ký (exec-wrapper / send-wrapper).
// Wrapper dựng lỗi -> bỏ qua, giữ hàm hiện tại.
const { selectOrdered } = require("../select/selector");
const { guard } = require("../select/health");

async function applyWrappers(kind, base, ctx) {
  let current = base;
  for (const cap of selectOrdered(kind, ctx)) {
    const inner = current;
    const wrapped = await guard(
      ctx.sessionId,
      cap,
      () => cap.wrap(inner, ctx),
      () => null,
    );
    if (typeof wrapped === "function") current = wrapped;
  }
  return current;
}

module.exports = { applyWrappers };
