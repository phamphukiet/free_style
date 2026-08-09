const { ipcMain } = require("electron");
const {
  chatCompletion,
  listModels,
  chatWithTools,
} = require("./gemini-client");
const {
  registerChatProvider,
  registerToolCapableProvider,
} = require("../../../chat/backend/providers-registry");

registerChatProvider("gemini", (apiKey, message, model) =>
  chatCompletion(apiKey, message, model),
);
registerToolCapableProvider("gemini", chatWithTools);

function registerGeminiBackend() {
  ipcMain.handle("api:create-key:gemini", async (event) => {
    try {
      const keyString = await event.sender.executeJavaScript(
        `window.prompt("Nhập API Key cho Google Gemini (AIza...):")`,
      );
      if (keyString && keyString.trim() !== "") {
        return { name: "Gemini Key", value: keyString.trim() };
      }
      return null;
    } catch (error) {
      console.error("Failed to prompt for Gemini key:", error);
      return null;
    }
  });

  ipcMain.handle("api:list-models:gemini", async (event, apiKey) => {
    try {
      return await listModels(apiKey);
    } catch (error) {
      console.error("Failed to list Gemini models:", error);
      return { error: error.message };
    }
  });

  ipcMain.handle("api:validate-key:gemini", async (event, keyData) => {
    try {
      await listModels(keyData.value);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  });
}

module.exports = { registerGeminiBackend };
