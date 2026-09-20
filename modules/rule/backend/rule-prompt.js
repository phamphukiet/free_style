// rule-prompt.js
// Rule áp dụng cho agent → system prompt. Nguồn DUY NHẤT: .vibe/rules/.
// Có lời dẫn để agent trả lời "đang dùng rule gì" ngay từ prompt, không gọi tool.

const local = require("./local/local-store");

function buildRulePrompt({ agentId }) {
  if (!agentId) return "";
  const rules = local
    .list()
    .filter(
      (r) => r.enabled && r.content.trim() && r.agentIds.includes(agentId),
    );
  if (rules.length === 0) return "";
  const body = rules.map((r) => `### ${r.name}\n${r.content}`).join("\n\n");
  return (
    `# Rule đang áp dụng cho bạn (${rules.length})\n` +
    `Bạn PHẢI tuân thủ. Khi được hỏi đang dùng rule nào, trả lời trực tiếp ` +
    `từ danh sách này, KHÔNG gọi tool hay đọc file.\n\n${body}`
  );
}

module.exports = { buildRulePrompt };
