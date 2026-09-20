// provider-factory.js
// Trách nhiệm duy nhất: registerProvider(config) — đăng ký IPC handler +
// đăng ký vào chat provider registry. Thêm provider mới (chatgpt, gemini...)
// KHÔNG cần sửa file này.

const { ipcMain } = require("electron");
const {
  registerCapability,
} = require("../../../shared/capability-registry.js");
const { CHANNEL } = require("./const.js");

registerCapability({ id, kind: "provider", aliases, client });

function registerProvider(config) {
  const { id, client, maxFileMB = 100, aliases = [], validate } = config;

  ipcMain.handle(CHANNEL.createKey(id), () => null);

  ipcMain.handle(CHANNEL.validateKey(id), async (event, keyData) => {
    if (!validate) return { success: true };
    try {
      return await validate(keyData.value);
    } catch (error) {
      return { success: false, message: error.message };
    }
  });

  ipcMain.handle(CHANNEL.listModels(id), (event, apiKey) =>
    client.listModels ? client.listModels(apiKey) : [],
  );

  ipcMain.handle(CHANNEL.fileLimit(id), () => maxFileMB);

  registerChatProvider(id, client.chatCompletion);
  if (client.chatWithTools)
    registerToolCapableProvider(id, client.chatWithTools);
  if (client.listModels) registerModelLister(id, client.listModels);
  registerProviderAliases(id, [id, ...aliases]);
}

module.exports = { registerProvider };
