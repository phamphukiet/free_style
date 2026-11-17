// Module đăng ký tên có thể @mention trong chat; chat chỉ đọc.
// `tool` = tool được ưu tiên khi mention này xuất hiện (mặc định trùng tên).
const mentions = new Map(); // name -> { hint, tool }

function registerMention(name, { hint = "", tool = name } = {}) {
  mentions.set(name, { hint, tool });
}

const listMentions = () =>
  [...mentions].map(([name, { hint, tool }]) => ({ name, hint, tool }));

const MENTION = /(?<![\w@])@([a-z][a-z0-9-]*)/gi;

// Trả [{ name, toolName, hint }], chỉ gồm mention đã đăng ký, không trùng.
function extractMentions(text) {
  const found = new Map();
  for (const match of String(text ?? "").matchAll(MENTION)) {
    const name = match[1].toLowerCase();
    const entry = mentions.get(name);
    if (entry && !found.has(name)) {
      found.set(name, { name, toolName: entry.tool, hint: entry.hint });
    }
  }
  return [...found.values()];
}

module.exports = { registerMention, listMentions, extractMentions };
