// index.js
// exec-wrapper: mọi lần xoá của tool files/agent đều hiện hộp thoại xác nhận cho người dùng.
// `confirmed` do model tự đặt không còn giá trị: wrapper tự gắn confirmed=true sau khi người dùng đồng ý.

const {
  registerCapability,
} = require("../../../../../shared/core/capability-registry.js");
const confirm = require("../../../../../shared/command/confirm");
const audit = require("../../../../../shared/command/audit");

const targets = (args) => [].concat(args.paths ?? args.path ?? []).join(", ");

// tên tool -> hàm trả nhãn nếu lần gọi này cần xác nhận, ngược lại null
const GUARDED = {
  files: (args) => (args.action === "delete" ? `Xoá: ${targets(args)}` : null),
  agent: (args) => (args.action === "delete" ? `Xoá agent: ${args.id}` : null),
};

function wrap(inner, ctx) {
  const caller = {
    kind: "ai",
    agentId: ctx.agentId,
    sessionId: ctx.sessionId,
    windowId: ctx.windowId,
  };
  return async (name, args = {}) => {
    const label = Object.hasOwn(GUARDED, name) ? GUARDED[name](args) : null;
    if (!label) return inner(name, args);
    const id = `${name}.${args.action}`;
    const cmd = { id, label, risk: "destructive" };
    const { approved } = await confirm.ask({
      cmd,
      args,
      caller,
      reason: "Thao tác xoá do AI yêu cầu.",
    });
    audit.record({
      caller,
      id,
      risk: "destructive",
      decision: approved ? "ask_approved" : "ask_denied",
      outcome: approved ? "forwarded" : "not_run",
      args,
    });
    if (!approved) {
      return {
        error:
          "Người dùng đã từ chối thao tác xoá. Không thử lại trừ khi người dùng yêu cầu.",
      };
    }
    return inner(name, { ...args, confirmed: true });
  };
}

function register() {
  registerCapability({
    id: "confirm-destructive",
    kind: "exec-wrapper",
    wrap,
    order: 10,
  });
}

module.exports = { register };
