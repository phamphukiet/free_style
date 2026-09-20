// providers-registry.js
// Trách nhiệm duy nhất: nơi các provider backend đăng ký hàm sendMessage(apiKey, message),
// để chat/backend/index.js gọi đúng provider mà không cần if/else hardcode.

const providers = {};

function registerChatProvider(id, sendMessage) {
  providers[id] = sendMessage;
}

function getChatProvider(id) {
  return providers[id];
}

const toolProviders = {};

function registerToolCapableProvider(id, sendMessageWithTools) {
  toolProviders[id] = sendMessageWithTools;
}

function getToolCapableProvider(id) {
  return toolProviders[id];
}

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