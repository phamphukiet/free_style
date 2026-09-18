// mention-registry.js
// Registry mention (@keyword) dùng chung — mỗi module tự đăng ký lúc load
// (trong chính backend/index.js của module đó).
// Module bị đóng băng (comment khỏi active-modules.js) -> không require tới
// đây -> mention tự biến mất, KHÔNG cần sửa file nào khác.

const mentions = {}; // { [keyword]: { toolName, hint } }

function registerMention(keyword, info) {
  mentions[keyword.toLowerCase()] = { toolName: keyword, ...info };
}

function getMention(keyword) {
  return mentions[keyword.toLowerCase()] || null;
}

// Trả về mảng { toolName, hint } cho các @keyword tìm thấy trong message,
// bỏ qua @keyword không có module nào đăng ký (module đóng băng / gõ sai).
function extractMentions(message) {
  const matches = message.match(/@([a-zA-Z0-9_-]+)/g) || [];
  const found = matches.map((m) => getMention(m.slice(1))).filter(Boolean);
  return [...new Map(found.map((m) => [m.toolName, m])).values()];
}

module.exports = { registerMention, getMention, extractMentions };
