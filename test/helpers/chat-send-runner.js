// chat-send-runner.js
// Chạy lại đúng luồng modules/chat/backend/send/handle-send.js, log ngắn gọn.

const path = require("path");
const root = (p) => path.join(__dirname, "../..", p);

const L = (msg) => console.log(msg);
const short = (obj) => JSON.stringify(obj);

async function runChatSendTest(testCase) {
  const { app } = require("electron");

  // Trỏ đúng userData như app thật (electron test/... mặc định lấy tên "Electron").
  try {
    const pkg = require(root("package.json"));
    app.setName(pkg.productName || pkg.name);
  } catch {
    L("⚠️ Không đọc được package.json gốc — có thể lệch userData path");
  }

  await app.whenReady();
  L(`[0] ready | userData=${app.getPath("userData")}`);

  require(root("src/main/ipc.js")).registerWindowIpc();
  L("[1] backend registered");

  const sessionStore = require(root("modules/chat/backend/session/store"));
  const { buildContext, resolveKey } = require(
    root("modules/chat/backend/send/context"),
  );
  const { pickProvider, selectTools } = require(
    root("modules/chat/backend/select/selector"),
  );
  const { buildPrompt } = require(root("modules/chat/backend/send/prompt"));
  const { runChat } = require(root("modules/chat/backend/send/run"));

  let sessionId = testCase.sessionId;
  if (!sessionId) {
    sessionId = sessionStore.save({
      agentId: testCase.agentId || null,
      title: "Test: " + testCase.message,
      messages: [],
      tokenUsed: 0,
    }).id;
  }
  L(`[2] session=${sessionId}${testCase.sessionId ? "" : " (new)"}`);

  const payload = {
    message: testCase.message,
    sessionId,
    agentId: testCase.agentId || null,
    providerId: testCase.providerId || null,
    keyId: testCase.keyId || null,
    model: testCase.model || null,
  };
  L(`[3] payload: ${short(payload)}`);

  const ctx = buildContext(payload);
  L(
    `[4] ctx: providerId=${ctx.providerId} keyId=${ctx.keyId || "-"} model=${ctx.model || "-"}`,
  );

  const provider = pickProvider(ctx.providerId);
  L(`[5] provider found=${!!provider}`);
  if (!provider) {
    L(`❌ NO_PROVIDER: "${ctx.providerId || "?"}" chưa đăng ký/bị tắt.`);
    return { ok: false };
  }

  const apiKey = resolveKey(ctx.providerId, ctx.keyId);
  L(`[6] key found=${!!apiKey}`);
  if (!apiKey) {
    L(
      `❌ NO_KEY: chưa có API key cho "${ctx.providerId}" (kiểm tra userData ở bước [0]).`,
    );
    return { ok: false };
  }

  const systemPrompt = await buildPrompt(ctx);
  L(`[7] systemPrompt len=${systemPrompt.length}`);

  const tools = selectTools(ctx);
  L(`[8] tools=${short(tools.map((t) => t.spec.name))}`);

  const reply = await runChat(ctx, provider, apiKey, (ch, info) =>
    L(`   notify(${ch}): ${short(info)}`),
  );
  L(
    `[9] reply: tokens=${reply.tokenUsed} content="${reply.content.slice(0, 200)}"`,
  );

  sessionStore.appendMessage(sessionId, { role: "user", content: ctx.message });
  sessionStore.appendMessage(
    sessionId,
    { role: "assistant", content: reply.content },
    reply.tokenUsed,
  );
  const lastTool = ctx.calledTools[ctx.calledTools.length - 1];
  if (lastTool) sessionStore.setLastTool(sessionId, lastTool);
  L(`[10] saved | messages=${sessionStore.get(sessionId).messages.length}`);

  L("✅ DONE — tương đương gõ prompt + bấm 'Gửi'.");
  return { ok: true, sessionId, reply };
}

module.exports = { runChatSendTest };
