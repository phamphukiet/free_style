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
const { readState, writeState } = require("../../../src/main/state");

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
    return require("../../settings/backend/index.js").aiBridge;
  } catch (e) {
    console.warn("[chat] Module settings không có mặt — bỏ qua tool-calling.");
    return null;
  }
}

const settingsBridge = loadSettingsBridge();

function executeSettingsTool(name, args) {
  if (!settingsBridge) throw new Error("Settings module không khả dụng");
  if (name !== "settings") throw new Error(`Tool "${name}" không tồn tại`);
  return settingsBridge.execute(args.action, args);
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
          const spec = settingsBridge.getToolSpec();
          content = await toolSend(
            apiKey,
            message,
            model,
            spec,
            executeSettingsTool,
          );
        } else {
          content = await sendMessage(apiKey, message, model);
        }
        return { content };
      } catch (error) {
        return { content: `Lỗi: ${error.message}` };
      }
    },
  );

  ipcMain.handle("chat:save-selection", (event, selection) => {
    writeState({ chatSelection: selection });
    return true;
  });

  ipcMain.handle("chat:load-selection", () => {
    return readState().chatSelection || null;
  });
}

module.exports = { registerChatBackend };