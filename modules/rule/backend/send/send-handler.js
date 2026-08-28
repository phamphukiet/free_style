const { resolveKey, resolveFromAgent, executeSettingsTool, buildSystemPrompt } = require("./resolve");

async function handleSend(settingsBridge, { message, providerId, keyId, model, agentId, sessionId }) {
  // ... phần resolve provider/key giữ nguyên như cũ ...

  const systemPrompt = buildSystemPrompt(agentId);

  // ...
  if (toolSend) {
    const spec = settingsBridge.getToolSpec();
    const execTool = (n, a) => executeSettingsTool(settingsBridge, n, a);
    const raw = await toolSend(apiKey, message, resolvedModel, systemPrompt, spec, execTool);
    content = typeof raw === "object" ? raw.content ?? raw : raw;
    tokenUsed = raw?.usage?.totalTokens ?? 0;
  } else {
    const raw = await sendMessage(apiKey, message, resolvedModel, systemPrompt);
    content = typeof raw === "object" ? raw.content ?? raw : raw;
    tokenUsed = raw?.usage?.totalTokens ?? 0;
  }