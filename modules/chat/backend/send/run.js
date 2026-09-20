// run.js — chạy 1 lượt: dựng prompt, chọn tool, gọi provider.
const { selectTools } = require("../select/selector");
const { buildPrompt } = require("./prompt");
const { applyWrappers } = require("./wrappers");
const { makeExecutor } = require("./executor");

function toContent(raw) {
  if (typeof raw === "string") return raw;
  return raw?.content ?? JSON.stringify(raw);
}

const toTokens = (raw) => raw?.usage?.totalTokens ?? 0;

async function sendWithTools({
  provider,
  apiKey,
  ctx,
  tools,
  systemPrompt,
  notify,
}) {
  const base = makeExecutor(tools, ctx, notify);
  const executeToolCall = await applyWrappers("exec-wrapper", base, ctx);
  const opts = {
    systemPrompt,
    toolSpecs: tools.map((t) => t.spec),
    executeToolCall,
  };
  const baseSend = () =>
    provider.client.chatWithTools(apiKey, ctx.message, ctx.model, opts);
  const send = await applyWrappers("send-wrapper", baseSend, ctx);
  return send();
}

async function runChat(ctx, provider, apiKey, notify) {
  const systemPrompt = await buildPrompt(ctx);
  const tools = selectTools(ctx);
  const useTools = tools.length > 0 && Boolean(provider.client.chatWithTools);

  const raw = useTools
    ? await sendWithTools({
        provider,
        apiKey,
        ctx,
        tools,
        systemPrompt,
        notify,
      })
    : await provider.client.chatCompletion(
        apiKey,
        ctx.message,
        ctx.model,
        systemPrompt,
      );

  const skipped = tools.length > 0 && !useTools;
  return {
    content: toContent(raw),
    tokenUsed: toTokens(raw),
    notice: skipped
      ? `Provider "${provider.id}" không hỗ trợ tool, đã bỏ qua ${tools.length} tool.`
      : "",
  };
}

module.exports = { runChat };