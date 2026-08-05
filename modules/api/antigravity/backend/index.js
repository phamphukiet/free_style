const { ipcMain } = require("electron");

function registerAntigravityBackend() {
  ipcMain.handle("api:create-key:antigravity", async (event) => {
    try {
      const keyString = await event.sender.executeJavaScript(`window.prompt("Nhập cấu hình kết nối cho Antigravity (Local URL, v.v.):")`);
      if (keyString && keyString.trim() !== "") {
        return { name: "Antigravity Endpoint", value: keyString.trim() };
      }
      return null;
    } catch (error) {
      console.error("Failed to prompt for Antigravity config:", error);
      return null;
    }
  });
}

module.exports = { registerAntigravityBackend };
