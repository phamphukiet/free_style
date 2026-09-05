// provider-resolve.js
// Trách nhiệm duy nhất: từ hint tự nhiên (tên provider/key/model) suy ra
// providerId + apiKey thật + model hợp lệ. Không đụng agent store.

const {
  loadCredentialsSync,
  decrypt,
} = require("../../../../src/main/ipc/credentials/storage");

const PROVIDER_ALIASES = {
  chatgpt: ["chatgpt", "openai", "gpt"],
  gemini: ["gemini", "google"],
  codex: ["codex"],
  antigravity: ["antigravity", "local"],
};

const modelListers = {};
function registerModelLister(id, listModels) {
  modelListers[id] = listModels;
}

function getModelLister(id) {
  return modelListers[id];
}
const providerAliases = {};
function registerProviderAliases(id, aliases) {
  providerAliases[id] = aliases;
}
function resolveProviderIdByHint(hint) {
  if (!hint) return null;
  const h = hint.toLowerCase();
  const match = Object.entries(providerAliases).find(
    ([id, aliases]) => h.includes(id) || aliases.some((a) => h.includes(a)),
  );
  return match ? match[0] : null;
}

function resolveProviderId(hint) {
  if (!hint) return null;
  const h = hint.toLowerCase();
  for (const [id, aliases] of Object.entries(PROVIDER_ALIASES)) {
    if (aliases.some((a) => h.includes(a))) return id;
  }
  return null;
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
  const {
    getModelLister,
  } = require("../../../chat/backend/providers-registry");
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
  registerChatProvider,
  getChatProvider,
  registerToolCapableProvider,
  getToolCapableProvider,
  registerModelLister,
  getModelLister,
  registerProviderAliases,
  resolveProviderIdByHint,
};
