const { ipcMain } = require("electron");

function registerChatGptBackend() {
  ipcMain.handle("api:create-key:chatgpt", async (event) => {
    try {
      // Yêu cầu frontend hiển thị prompt (native dialog của Chromium)
      const keyString = await event.sender.executeJavaScript(`window.prompt("Nhập API Key cho ChatGPT (sk-...):")`);
      if (keyString && keyString.trim() !== "") {
        return { name: "ChatGPT Key", value: keyString.trim() };
      }
      return null;
    } catch (error) {
      console.error("Failed to prompt for ChatGPT key:", error);
      return null;
    }
  });

  ipcMain.handle("api:validate-key:chatgpt", async (event, keyData) => {
    try {
      const apiKey = keyData.value;
      // Gọi thử API để test key
      const response = await fetch("https://api.openai.com/v1/models", {
        headers: {
          "Authorization": `Bearer ${apiKey}`
        }
      });
      
      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData?.error?.message || "Key không hợp lệ hoặc bị từ chối truy cập." };
      }
    } catch (error) {
      console.error("Failed to validate ChatGPT key:", error);
      return { success: false, message: "Lỗi kết nối mạng: " + error.message };
    }
  });
}

module.exports = { registerChatGptBackend };
