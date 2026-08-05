const { ipcMain } = require("electron");

function registerCodexBackend() {
  ipcMain.handle("api:create-key:codex", async (event) => {
    try {
      const keyString = await event.sender.executeJavaScript(`window.prompt("Nhập API Key cho OpenAI Codex (sk-...):")`);
      if (keyString && keyString.trim() !== "") {
        return { name: "Codex Key", value: keyString.trim() };
      }
      return null;
    } catch (error) {
      console.error("Failed to prompt for Codex key:", error);
      return null;
    }
  });
}

module.exports = { registerCodexBackend };
