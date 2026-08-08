// index.js
// Trách nhiệm duy nhất: xử lý IPC gửi tin nhắn chat.
// Giai đoạn này chưa gọi LLM thật — chỉ echo lại để xác nhận luồng hoạt động.
// Bước sau: dùng providerId/keyId để gọi API thật (OpenAI, Gemini...).

const { ipcMain } = require("electron");
const { getChatProvider } = require("./providers-registry");
const {
  loadCredentialsSync,
  decrypt,
} = require("../../../src/main/ipc/credentials-storage");

function resolveKey(providerId, keyId) {
  if (!providerId) return null;
  const data = loadCredentialsSync();
  const entries = data[providerId]?.keys;
  if (!entries) return null;
  const entry = keyId ? entries.find((k) => k.id === keyId) : entries[0];
  return entry ? decrypt(entry) : null;
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

      const sendMessage = getChatProvider(providerId);
      if (!sendMessage) {
        return { content: `Provider "${providerId}" chưa hỗ trợ chat thật.` };
      }

      try {
        const content = await sendMessage(apiKey, message, model);
        return { content };
      } catch (error) {
        return { content: `Lỗi: ${error.message}` };
      }
    },
  );
}

module.exports = { registerChatBackend };
