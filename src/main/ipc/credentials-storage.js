const { safeStorage, app } = require("electron");
const fs = require("fs");
const path = require("path");

function getCredentialsPath() {
  const userDataPath = app.getPath("userData");
  return path.join(userDataPath, "credentials.json");
}

function loadCredentialsSync() {
  const credPath = getCredentialsPath();
  if (!fs.existsSync(credPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(credPath, "utf-8"));
  } catch (error) {
    console.error("Failed to read credentials file:", error);
    return {};
  }
}

function saveCredentialsSync(data) {
  const credPath = getCredentialsPath();
  fs.writeFileSync(credPath, JSON.stringify(data, null, 2), "utf-8");
  console.log("[Credentials] Saved to:", credPath);
}

function encrypt(text) {
  if (safeStorage.isEncryptionAvailable()) {
    return { encrypted: safeStorage.encryptString(text).toString("base64") };
  }
  return { plaintext: text };
}

function decrypt(data) {
  if (data.encrypted && safeStorage.isEncryptionAvailable()) {
    return safeStorage.decryptString(Buffer.from(data.encrypted, "base64"));
  }
  return data.plaintext || null;
}

module.exports = {
  loadCredentialsSync,
  saveCredentialsSync,
  encrypt,
  decrypt,
};
