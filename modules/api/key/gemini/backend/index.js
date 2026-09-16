// index.js
// Chỉ khai báo phần khác biệt của Gemini; logic IPC dùng chung nằm ở
// modules/api/backend/provider-factory.js. Gemini không cần validate riêng
// (dùng mặc định: gọi thử listModels).

const { registerProvider } = require("../../../backend/provider-factory.js");
const {
  chatCompletion,
  listModels,
  chatWithTools,
} = require("./gemini-client.js");
const { MAX_FILE_MB } = require("./const/index.js");

function register() {
  registerProvider({
    id: "gemini",
    aliases: ["google"],
    maxFileMB: MAX_FILE_MB,
    client: { chatCompletion, listModels, chatWithTools },
    keyPrompt: {
      label: "Nhập API Key cho Google Gemini (AIza...):",
      name: "Gemini Key",
    },
  });
}

module.exports = { register, MAX_FILE_MB };
