// caller.js
// Dựng "người gọi" cho bus từ ctx của chat (toolContext hoặc ctx của buildPrompt).
// tainted = lượt này model đã đọc nội dung không tin cậy → lệnh ghi phải hỏi người dùng.

const UNTRUSTED_SOURCES = ["files"];

const isTainted = (called) =>
  (called ?? []).some((id) => UNTRUSTED_SOURCES.includes(id));

function callerOf(source) {
  return {
    kind: "ai",
    agentId: source?.agentId ?? null,
    sessionId: source?.sessionId ?? null,
    windowId: source?.windowId ?? null,
    tainted: isTainted(source?.calledTools),
  };
}

module.exports = { callerOf };