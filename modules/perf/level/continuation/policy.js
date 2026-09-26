// policy.js
const DONE_PREFIX = "HOÀN THÀNH:";
const ASK_PREFIX = "CẦN HỎI:";

function needsContinuation(content) {
  if (typeof content !== "string") return false;
  const trimmed = content.trim();
  return !trimmed.startsWith(DONE_PREFIX) && !trimmed.startsWith(ASK_PREFIX);
}

module.exports = { needsContinuation, DONE_PREFIX, ASK_PREFIX };
