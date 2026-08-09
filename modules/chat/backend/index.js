// index.js
// Trách nhiệm duy nhất: xử lý IPC gửi tin nhắn chat.
// providerId/keyId để gọi API thật (OpenAI, Gemini...). Với provider hỗ trợ
// tool-calling (VD: Gemini), agent có thể gọi lệnh settings qua executeSettingsTool.

const { ipcMain } = require("electron");
const {
  loadCredentialsSync,
  decrypt,
} = require("../../../src/main/ipc/credentials/storage");
const {
  getChatProvider,
  getToolCapableProvider,
} = require("./providers-registry");
const { getToolSpec } = require("../../settings/backend/tool-spec");
const settingsCommands = require("../../settings/backend/commands");
const { notifyChanged } = require("../../settings/backend/notify");
const prime = require("../../settings/backend/prime/index.js");
const themeCommands = require("../../settings/backend/prime/001_theme/theme.commands");

function resolveKey(providerId, keyId) {
  if (!providerId) return null;
  const data = loadCredentialsSync();
  const entries = data[providerId]?.keys;
  if (!entries) return null;
  const entry = keyId ? entries.find((k) => k.id === keyId) : entries[0];
  return entry ? decrypt(entry) : null;
}

// Cầu nối duy nhất giữa "tool call" của agent và command layer thật —
// đi qua đúng commands.js, không có đường tắt nào khác (giữ nguyên tắc
// một điểm vào duy nhất cho mọi thay đổi setting).
function executeSettingsTool(name, args) {
  if (name !== "settings") throw new Error(`Tool "${name}" không tồn tại`);
  switch (args.action) {
    case "list":
      return { items: settingsCommands.getSummary() };
    case "get":
      return { id: args.id, value: settingsCommands.getValue(args.id) };
    case "set": {
      const value = settingsCommands.setValue(args.id, args.value);
      notifyChanged(args.id, value);
      return { id: args.id, value };
    }
    default: {
      const handler = prime.getExtraActions()[args.action];
      if (!handler) throw new Error(`action "${args.action}" không hợp lệ`);
      const result = handler(args);
      if (args.action === "create_theme" || args.action === "set_theme") {
        notifyChanged("workbench.theme", themeCommands.getActiveThemeId());
        notifySchemaChanged({ id: "workbench.theme" });
      }
      return result;
    }
  }
}

function registerChatBackend() {
  ipcMain.handle(
    "chat:send",
    async (event, { message, providerId, keyId, model }) => {
      if (!providerId) {
        return { content: `Chưa chọn provider. Nhận: "${message}"` };
      }

      const apiKey = resolveKey(providerId, keyId);
      if (!apiKey) {
        return { content: `Chưa có API key hợp lệ cho "${providerId}".` };
      }

      const toolSend = getToolCapableProvider(providerId);
      const sendMessage = getChatProvider(providerId);
      if (!toolSend && !sendMessage) {
        return { content: `Provider "${providerId}" chưa hỗ trợ chat thật.` };
      }

      try {
        const hint = `${settingsCommands.getCompactSummary()} ${prime.getExtraHints()}`;
        const spec = getToolSpec(hint, Object.keys(prime.getExtraActions()));
        const content = toolSend
          ? await toolSend(apiKey, message, model, spec, executeSettingsTool)
          : await sendMessage(apiKey, message, model);
        return { content };
      } catch (error) {
        return { content: `Lỗi: ${error.message}` };
      }
    },
  );
}

module.exports = { registerChatBackend };
