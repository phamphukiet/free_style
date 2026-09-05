// provider-resolve.js
// Trách nhiệm duy nhất: từ hint tự nhiên (tên provider/key/model) suy ra
// providerId + apiKey thật + model hợp lệ. Không đụng agent store.

const {
  loadCredentialsSync,
  decrypt,
} = require("../../../../src/main/ipc/credentials/storage");

const {
  resolveProviderIdByHint,
  getModelLister,
} = require("../../../chat/backend/providers-registry");

function resolveProviderId(hint) {
  return resolveProviderIdByHint(hint);
}

function listAvailable() {
  const data = loadCredentialsSync();
  return Object.entries(data).map(([providerId, v]) => ({
    providerId,
    keys: (v.keys || []).map((k) => ({ id: k.id, name: k.name })),
  }));
}

function resolveKeyForProvider(providerId, keyHint) {
  const entries = loadCredentialsSync()[providerId]?.keys || [];
  if (entries.length === 0) return null;
  let entry = entries[0];
  if (keyHint) {
    const h = keyHint.toLowerCase();
    entry = entries.find((k) => k.name.toLowerCase().includes(h)) || entry;
  }
  const value = decrypt(entry);
  return value ? { keyId: entry.id, value } : null;
}

function loadListModels(providerId) {
  return getModelLister(providerId) || null;
}

async function resolveModel(providerId, apiKey, modelHint) {
  const listModels = loadListModels(providerId);
  if (!listModels) return modelHint || "";
  const models = await listModels(apiKey);
  if (!modelHint) return models[0]?.id || "";
  const h = modelHint.toLowerCase();
  const found = models.find((m) => m.id.toLowerCase().includes(h));
  return found ? found.id : models[0]?.id || "";
}

module.exports = {
  resolveProviderId,
  listAvailable,
  resolveKeyForProvider,
  resolveModel,
};
