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

function resolveKey(providerId, keyId) {
  if (!providerId) return null;
  const data = loadCredentialsSync();
  const entries = data[providerId]?.keys;
  if (!entries) return null;
  const entry = keyId ? entries.find((k) => k.id === keyId) : entries[0];
  return entry ? decrypt(entry) : null;
}

// Settings là optional dependency — chat phải chạy được dù module settings
// không tồn tại (đúng rule: modules độc lập, không hard-require nhau).
function loadSettingsBridge() {
  try {
    const { getToolSpec } = require("../../settings/backend/core/tool-spec");
    const settingsCommands = require("../../settings/backend/core/commands");
    const { notifyChanged } = require("../../settings/backend/core/notify");
    const sources = require("../../settings/backend/sources");
    return { getToolSpec, settingsCommands, notifyChanged, sources };
  } catch (e) {
    console.warn("[chat] Module settings không có mặt — bỏ qua tool-calling.");
    return null;
  }
}

const settingsBridge = loadSettingsBridge();

function executeSettingsTool(name, args) {
  if (!settingsBridge) throw new Error("Settings module không khả dụng");
  const { settingsCommands, notifyChanged, sources } = settingsBridge;
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
      const handler = sources.getExtraActions()[args.action];
      if (!handler) throw new Error(`action "${args.action}" không hợp lệ`);
      return handler(args);
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

      const toolSend = settingsBridge ? getToolCapableProvider(providerId) : null;
      const sendMessage = getChatProvider(providerId);
      if (!toolSend && !sendMessage) {
        return { content: `Provider "${providerId}" chưa hỗ trợ chat thật.` };
      }

      try {
        let content;
        if (toolSend) {
          const { settingsCommands, sources, getToolSpec } = settingsBridge;
          const hint = `${settingsCommands.getCompactSummary()} ${sources.getExtraHints()}`;
          const spec = getToolSpec(hint, Object.keys(sources.getExtraActions()));
          content = await toolSend(apiKey, message, model, spec, executeSettingsTool);
        } else {
          content = await sendMessage(apiKey, message, model);
        }
        return { content };
      } catch (error) {
        return { content: `Lỗi: ${error.message}` };
      }
    },
  );
}

module.exports = { registerChatBackend };