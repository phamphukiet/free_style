const { ipcMain } = require("electron");
const {
  loadCredentialsSync,
  saveCredentialsSync,
} = require("../credentials-storage");

function registerDeleteHandler() {
  ipcMain.handle("credentials:delete", (event, serviceId, keyId) => {
    try {
      const data = loadCredentialsSync();
      if (!data[serviceId]) return false;

      if (!keyId) delete data[serviceId];
      else if (data[serviceId].keys) {
        data[serviceId].keys = data[serviceId].keys.filter(
          (k) => k.id !== keyId,
        );
      }

      saveCredentialsSync(data);
      return true;
    } catch (error) {
      console.error("Failed to delete credentials:", error);
      return false;
    }
  });
}

module.exports = { registerDeleteHandler };
