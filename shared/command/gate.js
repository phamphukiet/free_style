// gate.js
// Cửa trước khi chạy: snapshot args → policy → validate → (hỏi người dùng).
// Trả { args, decision } để chạy, hoặc { stop: { decision, result } } để dừng.

const { validateArgs, snapshot } = require("./args");
const { evaluate } = require("./policy");
const { fail } = require("./result");

const stop = ({ cmd, decision, code, error }) => ({
  stop: { decision, result: fail({ cmd, code, error }) },
});

async function confirmWith({ cmd, args, caller, deps, reason }) {
  try {
    return await deps.confirm.ask({ cmd, args, caller, reason });
  } catch (error) {
    console.error("[command] confirm lỗi:", error.message);
    return { approved: false }; // lỗi hộp thoại = từ chối (fail-closed)
  }
}

async function askUser({ cmd, args, caller, deps, reason }) {
  const answer = await confirmWith({ cmd, args, caller, deps, reason });
  if (answer.approved) return { args, decision: "ask_approved" };
  if (answer.expired) {
    return stop({
      cmd,
      decision: "ask_expired",
      code: "EXPIRED",
      error: "hết hạn chờ người dùng xác nhận.",
    });
  }
  return stop({
    cmd,
    decision: "ask_denied",
    code: "USER_DENIED",
    error: "người dùng đã từ chối. Không thử lại trừ khi người dùng yêu cầu.",
  });
}

async function gate({ cmd, raw, caller, deps }) {
  const snap = snapshot(raw);
  if (snap.error) {
    return stop({
      cmd,
      decision: "invalid_args",
      code: "INVALID_ARGS",
      error: snap.error,
    });
  }
  const args = snap.value;
  const verdict = evaluate({ caller, cmd, args });
  if (verdict.decision === "deny") {
    return stop({
      cmd,
      decision: "policy_denied",
      code: "DENIED",
      error: verdict.reason,
    });
  }
  const argError = validateArgs({ schema: cmd.args, args });
  if (argError) {
    return stop({
      cmd,
      decision: "invalid_args",
      code: "INVALID_ARGS",
      error: argError,
    });
  }
  if (verdict.decision === "ask") {
    return askUser({ cmd, args, caller, deps, reason: verdict.reason });
  }
  return { args, decision: "allow" };
}

module.exports = { gate };
