// index.js — entry point DUY NHẤT send-handler.js gọi.
// Chạy strategy theo order, trả kết quả strategy đầu tiên match.
// Strategy match sẽ tự quyết có ghi lastToolUsed hay không (qua commit()).

const { loadStrategies } = require("./loader.js");
const { getStrategies } = require("./strategy-registry.js");

loadStrategies();

function resolvePriority(message, sessionId) {
  for (const s of getStrategies()) {
    const result = s.resolve({ message, sessionId });
    if (result) return { ...result, matchedStrategy: s };
  }
  return { priorityNames: [], matchedStrategy: null };
}

function commitPriority(matchedStrategy, ctx) {
  matchedStrategy?.commit?.(ctx);
}

module.exports = { resolvePriority, commitPriority };
