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
const { buildHistoryPrompt } = require("./history");
const { buildToolExecutor } = require("./tool-executor");

function loadTodoPrompt() {
  try {
    return require("../../../dedupe_level/level_03_todo/prompt.js")
      .renderTodoPrompt;
  } catch {
    return null;
  }
}

function loadContinuation() {
  try {
    return require("../../../dedupe_level/level_04_continuation/index.js");
  } catch {
    return null;
  }
}

async function handleSend(
  { message, providerId, keyId, model, agentId, sessionId },
  notify,
) {
  let resolvedProviderId = providerId;
  let resolvedKeyId = keyId;
  let resolvedModel = model;
  let history = [];

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
    history = sessionStore.get(sessionId)?.messages || []; // lấy lịch sử TRƯỚC khi append
    sessionStore.appendMessage(sessionId, { role: "user", content: message });
  }

  try {
    let content,
      tokenUsed = 0;
    const renderTodoPrompt = loadTodoPrompt();
    const systemPrompt = [
      buildSystemPrompt(agentId),
      buildHistoryPrompt(history),
      renderTodoPrompt ? renderTodoPrompt(sessionId) : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    if (toolSend) {
      const continuation = loadContinuation();
      const fullSystemPrompt = continuation
        ? [systemPrompt, continuation.buildContinuationGuide()]
            .filter(Boolean)
            .join("\n\n")
        : systemPrompt;
      const buildOpts = () => ({
        systemPrompt: fullSystemPrompt,
        toolSpecs: getToolSpecs(),
        executeToolCall: buildToolExecutor({ agentId, notify, sessionId }),
      });

      const result = continuation
        ? await continuation.runWithContinuation(
            toolSend,
            apiKey,
            resolvedModel,
            buildOpts,
            message,
          )
        : {
            content: await toolSend(
              apiKey,
              message,
              resolvedModel,
              buildOpts(),
            ),
          };

      const raw = result.content;
      content = typeof raw === "object" ? (raw.content ?? raw) : raw;
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
