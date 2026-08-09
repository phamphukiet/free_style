const { ipcMain } = require("electron");
const { loadCredentialsSync, decryptSafe } = require("./storage");

// Legacy: lấy giá trị key đầu tiên của 1 service, dùng cho chỗ chỉ cần 1 key duy nhất.
function registerLoadHandler() {
  ipcMain.handle("credentials:load", async (event, serviceId) => {
    try {
      const data = loadCredentialsSync();
      const serviceData = data[serviceId];
      if (!serviceData?.keys?.length) return null;
      return await decryptSafe(serviceData.keys[0]);
    } catch (error) {
      console.error("Failed to load credential:", error);
      return null;
    }
  });
}

module.exports = { registerLoadHandler };
