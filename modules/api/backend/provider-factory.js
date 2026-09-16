// provider-factory.js
// Trách nhiệm duy nhất: đăng ký registry + IPC chung cho MỌI provider trong
// modules/api/ (create-key, validate-key, list-models, file-limit). Provider
// con chỉ cần khai báo descriptor, không lặp lại logic IPC.

const { ipcMain } = require("electron");
const {
  registerChatProvider,
  registerToolCapableProvider,
  registerModelLister,
  registerProviderAliases,
} = require("../../chat/backend/providers-registry");

async function defaultValidate(listModels, apiKey) {
  await listModels(apiKey);
  return { success: true };
}

function registerProvider({
  id,
  aliases = [],
  maxFileMB,
  client,
  keyPrompt,
  validate,
}) {
  registerChatProvider(id, client.chatCompletion);
  if (client.chatWithTools)
    registerToolCapableProvider(id, client.chatWithTools);
  registerModelLister(id, client.listModels);
  if (aliases.length) registerProviderAliases(id, aliases);

  ipcMain.handle(`api:create-key:${id}`, async (event) => {
    try {
      const keyString = await event.sender.executeJavaScript(
        `window.prompt(${JSON.stringify(keyPrompt.label)})`,
      );
      return keyString?.trim()
        ? { name: keyPrompt.name, value: keyString.trim() }
        : null;
    } catch (error) {
      console.error(`Failed to prompt for ${id} key:`, error);
      return null;
    }
  });

  ipcMain.handle(`api:validate-key:${id}`, async (event, keyData) => {
    try {
      const check =
        validate || ((apiKey) => defaultValidate(client.listModels, apiKey));
      return await check(keyData.value);
    } catch (error) {
      return { success: false, message: error.message };
    }
  });

  ipcMain.handle(`api:list-models:${id}`, async (event, apiKey) => {
    try {
      return await client.listModels(apiKey);
    } catch (error) {
      console.error(`Failed to list ${id} models:`, error);
      return { error: error.message };
    }
  });

  ipcMain.handle(`api:file-limit:${id}`, () => maxFileMB);
}

module.exports = { registerProvider };