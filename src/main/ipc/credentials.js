const { ipcMain, safeStorage, app } = require("electron");
const fs = require("fs");
const path = require("path");

function getCredentialsPath() {
  const userDataPath = app.getPath("userData");
  const credPath = path.join(userDataPath, "credentials.json");
  return credPath;
}

function loadCredentialsSync() {
  const credPath = getCredentialsPath();
  if (!fs.existsSync(credPath)) {
    return {};
  }
  try {
    const data = fs.readFileSync(credPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read credentials file:", error);
    return {};
  }
}

function saveCredentialsSync(data) {
  const credPath = getCredentialsPath();
  fs.writeFileSync(credPath, JSON.stringify(data, null, 2), "utf-8");
  console.log("[Credentials] Saved to:", credPath); // Log the path as requested
}

function registerCredentialsIpc() {
  ipcMain.handle("credentials:save", (event, serviceId, keyString) => {
    try {
      const data = loadCredentialsSync();
      if (safeStorage.isEncryptionAvailable()) {
        const encrypted = safeStorage.encryptString(keyString);
        // Store as base64 or hex because buffer is not easily JSON serializable
        data[serviceId] = { encrypted: encrypted.toString('base64') };
      } else {
        // Fallback if safe storage is not available on this OS
        data[serviceId] = { plaintext: keyString };
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

      if (serviceData.encrypted && safeStorage.isEncryptionAvailable()) {
        const buffer = Buffer.from(serviceData.encrypted, 'base64');
        return safeStorage.decryptString(buffer);
      } else if (serviceData.plaintext) {
        return serviceData.plaintext;
      }
      return null;
    } catch (error) {
      console.error("Failed to load credentials:", error);
      return null;
    }
  });

  ipcMain.handle("credentials:delete", (event, serviceId) => {
    try {
      const data = loadCredentialsSync();
      if (data[serviceId]) {
        delete data[serviceId];
        saveCredentialsSync(data);
      }
      return true;
    } catch (error) {
      console.error("Failed to delete credentials:", error);
      return false;
    }
  });
}

module.exports = { registerCredentialsIpc };
