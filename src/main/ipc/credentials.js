const { ipcMain } = require("electron");
const crypto = require("crypto");
const {
  loadCredentialsSync,
  saveCredentialsSync,
  encrypt,
  decrypt,
  decryptSafe,
} = require("./credentials-storage");

function registerCredentialsIpc() {
  ipcMain.handle("credentials:list", async (event, serviceId) => {
    try {
      const data = loadCredentialsSync();
      const serviceData = data[serviceId];
      if (!serviceData) return [];
      if (serviceData.keys) {
        const results = await Promise.all(
          serviceData.keys.map(async (k) => ({
            id: k.id,
            name: k.name,
            value: await decryptSafe(k),
          })),
        );
        return results.filter((k) => k.value !== null);
      }
      return [];
    } catch (error) {
      console.error("Failed to list credentials:", error);
      return [];
    }
  });

  ipcMain.handle("credentials:save", async (event, serviceId, keyData) => {
    try {
      const data = loadCredentialsSync();
      if (!data[serviceId]) data[serviceId] = { keys: [] };
      if (!data[serviceId].keys) {
        const oldVal = decrypt(data[serviceId]);
        data[serviceId].keys = oldVal ? [{ id: "default", name: "Default Key", ...encrypt(oldVal) }] : [];
        delete data[serviceId].encrypted;
        delete data[serviceId].plaintext;
      }
      
      const keys = data[serviceId].keys;
      const id = keyData.id || crypto.randomUUID();
      const existingIdx = keys.findIndex(k => k.id === id);
      
      const newKeyEntry = { id, name: keyData.name || "New Key", ...encrypt(keyData.value) };

      if (existingIdx >= 0) {
        keys[existingIdx] = newKeyEntry;
      } else {
        keys.push(newKeyEntry);
      }
      
      saveCredentialsSync(data);
      return true;
    } catch (error) {
      console.error("Failed to save credentials:", error);
      return false;
    }
  });

  ipcMain.handle("credentials:load", (event, serviceId) => {
    try {
      const data = loadCredentialsSync();
      const serviceData = data[serviceId];
      if (!serviceData) return null;
      if (serviceData.encrypted || serviceData.plaintext) return decrypt(serviceData);
      if (serviceData.keys && serviceData.keys.length > 0) return decrypt(serviceData.keys[0]);
      return null;
    } catch (error) {
      return null;
    }
  });

  ipcMain.handle("credentials:delete", (event, serviceId, keyId) => {
    try {
      const data = loadCredentialsSync();
      if (!data[serviceId]) return false;
      
      if (!keyId) {
        delete data[serviceId];
      } else if (data[serviceId].keys) {
        data[serviceId].keys = data[serviceId].keys.filter(k => k.id !== keyId);
      }
      
      saveCredentialsSync(data);
      return true;
    } catch (error) {
      console.error("Failed to delete credentials:", error);
      return false;
    }
  });
}

module.exports = { registerCredentialsIpc };
