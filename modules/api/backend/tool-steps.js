// tool-steps.js
// Trách nhiệm duy nhất: chạy các tool call của MỘT bước + phát hiện vòng lặp không tiến triển.
// "Không tiến triển" = mọi call trong bước trùng hệt (tool, args, kết quả) với call đã thấy;
// 2 bước như vậy liên tiếp thì dừng.

const crypto = require("crypto");

const hash = (text) => crypto.createHash("sha1").update(text).digest("hex");

// Bỏ khoá "_..." (VD _dedupeNote của perf) để call trùng vẫn nhận ra là trùng.
function stable(result) {
  if (!result || typeof result !== "object") return JSON.stringify(result);
  return JSON.stringify(
    Object.entries(result).filter(([k]) => !k.startsWith("_")),
  );
}

const signature = ({ name, args, result }) =>
  hash(`${name}|${JSON.stringify(args)}|${stable(result)}`);

async function runCalls(calls, executeToolCall) {
  const done = [];
  for (const { functionCall } of calls) {
    const { id, name, args = {} } = functionCall;
    done.push({ id, name, args, result: await executeToolCall(name, args) });
  }
  return done;
}

const toResponseParts = (done) =>
  done.map(({ id, name, result }) => ({
    functionResponse: { id, name, response: { result } },
  }));

function createProgressTracker() {
  const seen = new Set();
  let lastWasRepeat = false;
  return {
    isStalled(done) {
      const sigs = done.map(signature);
      const repeat = sigs.every((s) => seen.has(s));
      sigs.forEach((s) => seen.add(s));
      const stalled = repeat && lastWasRepeat;
      lastWasRepeat = repeat;
      return stalled;
    },
  };
}

function stalledResult(executed) {
  return {
    content: `Dừng: model lặp lại đúng cùng lệnh gọi tool và nhận cùng kết quả ở hai bước liên tiếp (đã chạy ${executed} lần gọi tool).`,
    stopReason: "no_progress",
  };
}

module.exports = {
  runCalls,
  toResponseParts,
  createProgressTracker,
  stalledResult,
};