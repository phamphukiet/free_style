const { ipcMain } = require("electron");
const crypto = require("crypto");
const {
  loadCredentialsSync,
  saveCredentialsSync,
  encrypt,
  decrypt,
} = require("../credentials-storage");

function normalizeToKeysFormat(serviceData) {
  // Dữ liệu cũ (trước khi có multi-key) lưu 1 key trực tiếp, không có mảng `keys`.
  if (serviceData.keys) return serviceData;
  const oldVal = decrypt(serviceData);
  return {
    keys: oldVal
      ? [{ id: "default", name: "Default Key", ...encrypt(oldVal) }]
      : [],
  };
}

function registerSaveHandler() {
  ipcMain.handle("credentials:save", (event, serviceId, keyData) => {
    try {
      const data = loadCredentialsSync();
      data[serviceId] = normalizeToKeysFormat(data[serviceId] || { keys: [] });

      const keys = data[serviceId].keys;
      const id = keyData.id || crypto.randomUUID();
      const existingIdx = keys.findIndex((k) => k.id === id);
      const newKeyEntry = {
        id,
        name: keyData.name || "New Key",
        ...encrypt(keyData.value),
      };

      if (existingIdx >= 0) keys[existingIdx] = newKeyEntry;
      else keys.push(newKeyEntry);

      saveCredentialsSync(data);
      return true;
    } catch (error) {
      console.error("Failed to save credentials:", error);
      return false;
    }
  });
}

module.exports = { registerSaveHandler };
