const {
  getChatProvider,
  getToolCapableProvider,
} = require("../providers-registry");
const {
  resolveKey,
  resolveFromAgent,
  buildSystemPrompt,
} = require("./resolve");
const { getToolSpecs, executeAiTool } = require("./ai-tools");
const sessionStore = require("../session-store");

async function handleSend(
  { message, providerId, keyId, model, agentId, sessionId },
  notify,
) {
  let resolvedProviderId = providerId;
  let resolvedKeyId = keyId;
  let resolvedModel = model;

  if (agentId) {
    const agent = resolveFromAgent(agentId);
    if (agent) {
      resolvedProviderId = agent.providerId || providerId;
      resolvedKeyId = agent.keyId || keyId;
      resolvedModel = agent.model || model;
    }
  }

  if (!resolvedProviderId) {
    return { content: `Chưa chọn provider. Nhận: "${message}"` };
  }

  const apiKey = resolveKey(resolvedProviderId, resolvedKeyId);
  if (!apiKey) {
    return { content: `Chưa có API key hợp lệ cho "${resolvedProviderId}".` };
  }

  const toolSend =
    getToolSpecs().length > 0
      ? getToolCapableProvider(resolvedProviderId)
      : null;
  const sendMessage = getChatProvider(resolvedProviderId);
  if (!toolSend && !sendMessage) {
    return {
      content: `Provider "${resolvedProviderId}" chưa hỗ trợ chat thật.`,
    };
  }

  if (sessionId) {
    sessionStore.appendMessage(sessionId, { role: "user", content: message });
  }

  try {
    let content,
      tokenUsed = 0;
    const systemPrompt = buildSystemPrompt(agentId);

    if (toolSend) {
      const raw = await toolSend(apiKey, message, resolvedModel, {
        systemPrompt,
        toolSpecs: getToolSpecs(),
        executeToolCall: (name, args) =>
          executeAiTool(name, args, { agentId, notify }),
      });
      content = typeof raw === "object" ? (raw.content ?? raw) : raw;
      tokenUsed = raw?.usage?.totalTokens ?? 0;
    } else {
      const raw = await sendMessage(
        apiKey,
        message,
        resolvedModel,
        systemPrompt,
      );
      content = typeof raw === "object" ? (raw.content ?? raw) : raw;
      tokenUsed = raw?.usage?.totalTokens ?? 0;
    }
    if (sessionId)
      sessionStore.appendMessage(
        sessionId,
        { role: "assistant", content },
        tokenUsed,
      );
    return { content, tokenUsed };
  } catch (error) {
    return { content: `Lỗi: ${error.message}` };
  }
}

module.exports = { handleSend };
