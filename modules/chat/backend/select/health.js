// health.js — circuit breaker theo phiên: lỗi liên tiếp >= maxFailures thì bị bỏ qua tạm thời.
const { maxFailures, cooldownMs } = require("../../config");

const failures = new Map(); // "sessionId|kind:id" -> { count, at }

const keyOf = (sessionId, cap) => `${sessionId || "-"}|${cap.kind}:${cap.id}`;

function isTripped(sessionId, cap) {
  const entry = failures.get(keyOf(sessionId, cap));
  if (!entry) return false;
  return entry.count >= maxFailures && Date.now() - entry.at < cooldownMs;
}

// Chạy fn (sync/async). Lỗi -> đếm + trả onError(error), không ném ra ngoài.
async function guard(sessionId, cap, fn, onError) {
  const key = keyOf(sessionId, cap);
  try {
    const result = await fn();
    failures.delete(key);
    return result;
  } catch (error) {
    const count = (failures.get(key)?.count || 0) + 1;
    failures.set(key, { count, at: Date.now() });
    console.error(`[chat] ${cap.kind}:${cap.id} lỗi:`, error.message);
    return onError(error);
  }
}

module.exports = { isTripped, guard };
