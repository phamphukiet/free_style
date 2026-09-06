// history.js
// Trách nhiệm duy nhất: gộp lịch sử session cũ thành text nhúng vào systemPrompt.
// Không sửa từng provider client vì chúng chỉ nhận 1 message + systemPrompt.

function buildHistoryPrompt(messages) {
  if (!messages || messages.length === 0) return "";
  const lines = messages.map(
    (m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`,
  );
  return `## Lịch sử hội thoại trước đó (nhớ ngữ cảnh, không hỏi lại điều đã được trả lời):\n${lines.join("\n")}`;
}

module.exports = { buildHistoryPrompt };
