// multi-turn-runner.js
// Gửi nhiều tin nhắn liên tiếp cùng 1 session — dùng test luồng nhiều lượt
// (VD: "tạo folder X" rồi "thêm file Y" trong cùng ngữ cảnh).

const path = require("path");
const root = (p) => path.join(__dirname, "../..", p);

async function sendOneTurn(sessionId, testCase, message) {
  const { buildContext, resolveKey } = require(
    root("modules/chat/backend/send/context"),
  );
  const { pickProvider, selectTools } = require(
    root("modules/chat/backend/select/selector"),
  );
  const { buildPrompt } = require(root("modules/chat/backend/send/prompt"));
  const { runChat } = require(root("modules/chat/backend/send/run"));
  const sessionStore = require(root("modules/chat/backend/session/store"));

  const payload = {
    message,
    sessionId,
    agentId: testCase.agentId || null,
    providerId: testCase.providerId || null,
    keyId: testCase.keyId || null,
    model: testCase.model || null,
  };
  const ctx = buildContext(payload);

  const provider = pickProvider(ctx.providerId);
  if (!provider)
    throw new Error(
      `NO_PROVIDER: "${ctx.providerId || "?"}" chưa đăng ký/bị tắt.`,
    );
  const apiKey = resolveKey(ctx.providerId, ctx.keyId);
  if (!apiKey)
    throw new Error(`NO_KEY: chưa có API key cho "${ctx.providerId}".`);

  const systemPrompt = await buildPrompt(ctx);
  const tools = selectTools(ctx);
  const reply = await runChat(ctx, provider, apiKey, (ch, info) =>
    console.log(`   notify(${ch}): ${JSON.stringify(info)}`),
  );

  sessionStore.appendMessage(sessionId, { role: "user", content: ctx.message });
  sessionStore.appendMessage(
    sessionId,
    { role: "assistant", content: reply.content },
    reply.tokenUsed,
  );
  const lastTool = ctx.calledTools[ctx.calledTools.length - 1];
  if (lastTool) sessionStore.setLastTool(sessionId, lastTool);

  console.log(
    `   -> tools dùng: ${JSON.stringify(tools.map((t) => t.spec.name))}`,
  );
  console.log(`   -> reply: "${reply.content.slice(0, 200)}"`);
  return reply;
}

async function runMultiTurnTest(testCase) {
  const { app } = require("electron");
  try {
    const pkg = require(root("package.json"));
    app.setName(pkg.productName || pkg.name);
  } catch {
    console.log(
      "⚠️ Không đọc được package.json gốc — có thể lệch userData path",
    );
  }
  await app.whenReady();
  console.log(`[0] ready | userData=${app.getPath("userData")}`);

  require(root("src/main/ipc.js")).registerWindowIpc();
  console.log("[1] backend registered");

  const sessionStore = require(root("modules/chat/backend/session/store"));
  let sessionId = testCase.sessionId;
  if (!sessionId) {
    sessionId = sessionStore.save({
      agentId: testCase.agentId || null,
      title: "Test multi-turn: " + testCase.messages[0],
      messages: [],
      tokenUsed: 0,
    }).id;
  }
  console.log(`[2] session=${sessionId}${testCase.sessionId ? "" : " (new)"}`);

  const replies = [];
  for (let i = 0; i < testCase.messages.length; i++) {
    console.log(`\n--- Lượt ${i + 1}: "${testCase.messages[i]}" ---`);
    replies.push(await sendOneTurn(sessionId, testCase, testCase.messages[i]));
  }

  return { ok: true, sessionId, replies };
}

module.exports = { runMultiTurnTest };
