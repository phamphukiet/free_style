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
  const systemPrompt = buildSystemPrompt(agentId);
  const toolSend =
    getToolSpecs().length > 0
      ? getToolCapableProvider(resolvedProviderId)
      : null;
  const sendMessage = getChatProvider(resolvedProviderId);

  if (toolSend) {
    const spec = settingsBridge.getToolSpec();
    const execTool = (n, a) => executeSettingsTool(settingsBridge, n, a);
    const raw = await toolSend(apiKey, message, resolvedModel, {
      systemPrompt,
      toolSpecs: getToolSpecs(),
      executeToolCall: (name, args) =>
        executeAiTool(name, args, { agentId, notify }),
    });
    content = typeof raw === "object" ? (raw.content ?? raw) : raw;
    tokenUsed = raw?.usage?.totalTokens ?? 0;
  } else {
    const raw = await sendMessage(apiKey, message, resolvedModel, systemPrompt);
    content = typeof raw === "object" ? (raw.content ?? raw) : raw;
    tokenUsed = raw?.usage?.totalTokens ?? 0;
  }
}
