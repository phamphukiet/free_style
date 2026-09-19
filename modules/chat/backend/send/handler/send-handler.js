const {
  getChatProvider,
  getToolCapableProvider,
} = require("../../providers-registry.js");
const {
  resolveKey,
  resolveFromAgent,
  buildSystemPrompt,
} = require("./resolve");
const { getToolSpecs, executeAiTool } = require("../tool/ai-tools.js");
const sessionStore = require("../../session-store.js");
const { buildHistoryPrompt } = require("../history/history.js");
const { buildToolExecutor } = require("../tool/tool-executor.js");
const { resolvePriority, commitPriority } = require("../priority/index.js");
const {
  getSendWrappers,
} = require("../../../../../shared/chat-pipeline-registry.js");

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
  const { priorityNames, matchedStrategy } = resolvePriority(
    message,
    sessionId,
  );

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
    const { priorityNames } = resolvePriority(message, sessionId);
    const priorityHint = priorityNames.length
      ? `## Ưu tiên tool: ${priorityNames.join(", ")}. Dùng tool này nếu phù hợp yêu cầu.`
      : "";
    const systemPrompt = [
      buildSystemPrompt({ agentId, sessionId, message }),
      buildHistoryPrompt(history),
      priorityHint,
    ]
      .filter(Boolean)
      .join("\n\n");

    if (toolSend) {
      const calledTools = [];
      const rawExecutor = buildToolExecutor({ agentId, notify, sessionId });
      const executeToolCall = async (name, args) => {
        calledTools.push(name);
        return rawExecutor(name, args);
      };
      const buildOpts = () => ({
        systemPrompt,
        toolSpecs: getToolSpecs(priorityNames),
        executeToolCall,
      });

      const baseSend = () =>
        toolSend(apiKey, message, resolvedModel, buildOpts());
      const send = getSendWrappers().reduce((fn, w) => w.wrap(fn), baseSend);
      const raw = await send();
      content = typeof raw === "object" ? (raw.content ?? raw) : raw;
      commitPriority(matchedStrategy, { sessionId, calledTools });
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
