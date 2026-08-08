const { ipcMain } = require("electron");
const { loadCredentialsSync, decryptSafe } = require("../credentials-storage");

function registerListHandler() {
  ipcMain.handle("credentials:list", async (event, serviceId) => {
    try {
      const data = loadCredentialsSync();
      const serviceData = data[serviceId];
      if (!serviceData || !serviceData.keys) return [];

      const results = await Promise.all(
        serviceData.keys.map(async (k) => ({
          id: k.id,
          name: k.name,
          value: await decryptSafe(k),
        })),
      );
      return results.filter((k) => k.value !== null);
    } catch (error) {
      console.error("Failed to list credentials:", error);
      return [];
    }
  });
}

module.exports = { registerListHandler };
