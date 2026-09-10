const { ipcMain } = require("electron");
const { loadCredentialsSync, saveCredentialsSync } = require("./storage");

function registerDeleteHandler() {
  ipcMain.handle("credentials:delete", (event, serviceId, keyId) => {
    try {
      if (!keyId) return false;
      const data = loadCredentialsSync();
      if (!data[serviceId]?.keys) return false;

      data[serviceId].keys = data[serviceId].keys.filter((k) => k.id !== keyId);
      saveCredentialsSync(data);
      return true;
    } catch (error) {
      console.error("Failed to delete credentials:", error);
      return false;
    }
  });
}

module.exports = { registerDeleteHandler };
