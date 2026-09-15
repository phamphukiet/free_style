// policy.js
// Nguồn chân lý DUY NHẤT: 1 phản hồi text có thật sự "xong" hay bị ép dừng
// giữa chừng do hết step budget (xem LOOP_GUIDE trong gemini-chat-with-tools.js).

const DONE_PREFIX = "HOÀN THÀNH:";
const ASK_PREFIX = "CẦN HỎI:";

function needsContinuation(content) {
  if (typeof content !== "string") return false;
  const trimmed = content.trim();
  return !trimmed.startsWith(DONE_PREFIX) && !trimmed.startsWith(ASK_PREFIX);
}

module.exports = { needsContinuation, DONE_PREFIX, ASK_PREFIX };
