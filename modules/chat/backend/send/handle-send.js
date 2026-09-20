// handle-send.js — điều phối: chọn provider -> chạy -> lưu. Lỗi trả {ok:false}, KHÔNG lưu vào messages.
const sessionStore = require("../session/store");
const { pickProvider } = require("../select/selector");
const { buildContext, resolveKey } = require("./context");
const { runChat } = require("./run");

const fail = (code, message) => ({ ok: false, error: { code, message } });

// Chỉ lưu khi thành công -> history của lượt này chưa chứa tin đang gửi.
function saveTurn(ctx, reply) {
  if (!ctx.sessionId) return;
  const id = ctx.sessionId;
  sessionStore.appendMessage(id, { role: "user", content: ctx.message });
  sessionStore.appendMessage(
    id,
    { role: "assistant", content: reply.content },
    reply.tokenUsed,
  );
  const lastTool = ctx.calledTools[ctx.calledTools.length - 1];
  if (lastTool) sessionStore.setLastTool(id, lastTool);
}

async function handleSend(payload, notify) {
  const ctx = buildContext(payload);
  const provider = pickProvider(ctx.providerId);
  if (!provider) {
    return fail(
      "NO_PROVIDER",
      `Provider "${ctx.providerId || "?"}" chưa chọn, chưa đăng ký hoặc bị tắt trong config.`,
    );
  }
  try {
    const apiKey = resolveKey(ctx.providerId, ctx.keyId);
    if (!apiKey)
      return fail("NO_KEY", `Chưa có API key hợp lệ cho "${ctx.providerId}".`);
    const reply = await runChat(ctx, provider, apiKey, notify);
    saveTurn(ctx, reply);
    return { ok: true, ...reply };
  } catch (error) {
    return fail("SEND_FAILED", error.message);
  }
}

module.exports = { handleSend };
