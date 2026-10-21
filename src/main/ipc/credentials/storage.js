const { safeStorage } = require("electron");
const { registry } = require("../../../../shared/storage");

// Key API chỉ nằm ở tầng global (~/.vibe/credentials.json, mode 0o600),
// không cho vào workspace để khỏi bị commit theo project.
let storage = null;
const db = () =>
  (storage ??= registry.open({
    namespace: "credentials",
    scopes: ["global"],
    legacy: { file: "credentials.json", from: "userData" },
  }));

function loadCredentialsSync() {
  return db().entries();
}

function saveCredentialsSync(data) {
  const removed = Object.fromEntries(
    db()
      .keys()
      .filter((k) => !(k in data))
      .map((k) => [k, null]),
  );
  db().setMany({ entries: { ...data, ...removed } });
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

function withTimeout(fn, ms = 3000) {
  return Promise.race([
    Promise.resolve().then(fn),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("safeStorage timeout")), ms),
    ),
  ]);
}

async function decryptSafe(data) {
  try {
    return await withTimeout(() => decrypt(data));
  } catch (error) {
    console.error("[Credentials] decrypt timeout/lỗi:", error.message);
    return null;
  }
}

module.exports = {
  loadCredentialsSync,
  saveCredentialsSync,
  encrypt,
  decrypt,
  decryptSafe,
};
