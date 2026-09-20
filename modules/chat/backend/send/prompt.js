// prompt.js — chỉ NỐI kết quả các capability kind "prompt", không tự chuẩn hoá gì thêm.
const { selectOrdered } = require("../select/selector");
const { guard } = require("../select/health");

async function buildPrompt(ctx) {
  const parts = await Promise.all(
    selectOrdered("prompt", ctx).map((cap) =>
      guard(
        ctx.sessionId,
        cap,
        () => cap.build(ctx),
        () => "",
      ),
    ),
  );
  return parts.filter(Boolean).join("\n\n");
}

module.exports = { buildPrompt };
