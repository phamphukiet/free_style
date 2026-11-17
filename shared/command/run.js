// run.js
// Chạy 1 lệnh: gate → runner theo runIn → audit. Thêm nơi chạy mới = thêm 1 mục vào RUNNERS + AVAILABLE.

const { gate } = require("./gate.js");
const { fail, toResult, publicCaller } = require("./result.js");

const RUNNERS = {
  main: ({ cmd, args, caller }) => cmd.run(args, caller),
  renderer: ({ cmd, args, caller, deps }) =>
    deps.bridge.request({ id: cmd.id, args, windowId: caller?.windowId }),
};

// renderer chỉ khả dụng khi cửa sổ đích đã đăng ký handler (handshake): không có lệnh "ma".
const AVAILABLE = {
  main: () => true,
  renderer: ({ cmd, caller, deps }) =>
    Boolean(
      deps.bridge?.isAvailable({ id: cmd.id, windowId: caller?.windowId }),
    ),
};

const canRun = (input) =>
  Object.hasOwn(AVAILABLE, input.cmd.runIn) &&
  AVAILABLE[input.cmd.runIn](input);

async function execute({ cmd, args, caller, deps }) {
  try {
    const data = await RUNNERS[cmd.runIn]({ cmd, args, caller, deps });
    return { outcome: "ok", result: toResult(data) };
  } catch (error) {
    return {
      outcome: "error",
      result: fail({ cmd, code: "FAILED", error: error.message }),
    };
  }
}

/** @param {{ cmd: object, args?: object, caller: object, deps: object }} input */
async function runCommand({ cmd, args, caller, deps }) {
  const started = Date.now();
  const gated = await gate({ cmd, raw: args ?? {}, caller, deps });
  const ran = gated.stop
    ? null
    : await execute({ cmd, args: gated.args, caller, deps });
  const result = ran ? ran.result : gated.stop.result;
  deps.audit.record({
    caller: publicCaller(caller),
    id: cmd.id,
    risk: cmd.risk ?? null,
    decision: gated.stop ? gated.stop.decision : gated.decision,
    outcome: ran ? ran.outcome : "not_run",
    ms: Date.now() - started,
    args: gated.args ?? args,
    error: result.ok ? undefined : String(result.error).slice(0, 200),
  });
  return result;
}

module.exports = { runCommand, canRun };
