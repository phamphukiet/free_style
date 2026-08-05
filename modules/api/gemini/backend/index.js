const { ipcMain } = require("electron");

function registerGeminiBackend() {
  ipcMain.handle("api:create-key:gemini", async (event) => {
    try {
      const keyString = await event.sender.executeJavaScript(`window.prompt("Nhập API Key cho Google Gemini (AIza...):")`);
      if (keyString && keyString.trim() !== "") {
        return { name: "Gemini Key", value: keyString.trim() };
      }
      return null;
    } catch (error) {
      console.error("Failed to prompt for Gemini key:", error);
      return null;
    }
  });
}

module.exports = { registerGeminiBackend };
