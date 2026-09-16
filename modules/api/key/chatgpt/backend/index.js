// index.js
// Chỉ khai báo phần khác biệt của ChatGPT; logic IPC dùng chung nằm ở
// modules/api/backend/provider-factory.js.

const { registerProvider } = require("../../../backend/provider-factory.js");
const { chatCompletion, listModels } = require("./chatgpt-client.js");
const { MAX_FILE_MB } = require("./limits.js");

async function validate(apiKey) {
  const response = await fetch("https://api.openai.com/v1/models", {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (response.ok) return { success: true };
  const err = await response.json().catch(() => ({}));
  return {
    success: false,
    message:
      err?.error?.message || "Key không hợp lệ hoặc bị từ chối truy cập.",
  };
}

function register() {
  registerProvider({
    id: "chatgpt",
    aliases: ["chatgpt", "openai", "gpt"],
    maxFileMB: MAX_FILE_MB,
    client: {
      chatCompletion: (apiKey, message, model, systemPrompt) =>
        chatCompletion(apiKey, message, model || "gpt-4o-mini", systemPrompt),
      listModels,
    },
    keyPrompt: {
      label: "Nhập API Key cho ChatGPT (sk-...):",
      name: "ChatGPT Key",
    },
    validate,
  });
}

module.exports = { register, MAX_FILE_MB };
