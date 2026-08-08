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

module.exports = { registerChatProvider, getChatProvider };
