// reply-format.js: câu trả lời ngắn từ mẫu, không dùng AI.
const nameOf = (item) => item.label ?? item.key;

function done({ command, items, sent }) {
  if (sent) return `Đã gửi lệnh “${command.label}”.`;
  if (!items) return `Đã chạy: ${command.label}.`;
  if (items.length === 0) return `${command.label}: không có mục nào.`;
  const good = items.filter((i) => i.ok).map(nameOf);
  const bad = items.filter((i) => !i.ok);
  const head = `${command.label}: ${good.length}/${items.length} mục`;
  const okPart = good.length ? ` (${good.join(", ")})` : "";
  const badPart = bad.length
    ? `. Lỗi: ${bad.map((i) => `${nameOf(i)} — ${i.error}`).join("; ")}`
    : ".";
  return head + okPart + badPart;
}

const cancelled = () => "Đã huỷ, không có gì bị thay đổi.";
const failed = (error) => `Lỗi: ${error.message}`;
const pickCommand = (options) =>
  `Ý bạn là: ${options.map((c) => c.label).join(" / ")}? Hãy nói rõ hơn.`;
const crowded = ({ name, hits }) =>
  `“${name}” khớp nhiều mục: ${hits.map((h) => h.label).join(", ")}. Hãy gõ rõ hơn (ví dụ đường dẫn đầy đủ).`;

module.exports = { done, cancelled, failed, pickCommand, crowded };
