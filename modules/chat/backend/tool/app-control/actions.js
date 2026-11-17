// actions.js
// Ba action, chỉ ủy quyền cho shared/command. Lỗi mong đợi TRẢ VỀ {ok:false}
// thay vì throw: throw sẽ bị guard() đếm vào circuit breaker của phiên.

const command = require("../../../../../shared/command");
const { ok, fail, formatList, suggestIds } = require("./format");
const { callerOf } = require("./caller");

function parseArgs(raw) {
  if (raw === undefined || raw === null || raw === "") return { args: {} };
  if (typeof raw !== "string") return { args: raw };
  try {
    return { args: JSON.parse(raw) };
  } catch {
    return { error: "args phải là chuỗi JSON object hợp lệ." };
  }
}

function notFound({ id, caller }) {
  const { commands } = command.list({ caller });
  const ids = suggestIds({ id, ids: commands.map((c) => c.id) });
  const hint = ids.length
    ? `Ý bạn là: ${ids.join(", ")}?`
    : "Dùng action=list để xem lệnh khả dụng.";
  return fail(`Lệnh "${id}" không tồn tại hoặc không khả dụng. ${hint}`);
}

function list({ module, caller }) {
  const { commands } = command.list({ caller, module });
  return formatList({ commands, module });
}

function describe({ id, caller }) {
  if (!id) return fail("Thiếu tham số id.");
  const view = command.describe({ caller, id });
  return view ? ok(view) : notFound({ id, caller });
}

async function run({ id, args, caller }) {
  if (!id) return fail("Thiếu tham số id.");
  const parsed = parseArgs(args);
  if (parsed.error) return fail(parsed.error);
  const result = await command.run({ caller, id, args: parsed.args });
  return result.code === "NOT_FOUND" ? notFound({ id, caller }) : result;
}

// (args do model gửi, tctx do chat/send/executor.js truyền)
async function execute(args = {}, tctx) {
  const caller = callerOf(tctx);
  switch (args.action) {
    case "list":
      return list({ module: args.module, caller });
    case "describe":
      return describe({ id: args.id, caller });
    case "run":
      return run({ id: args.id, args: args.args, caller });
    default:
      return fail(
        `Action "${args.action}" không tồn tại. Dùng list | describe | run.`,
      );
  }
}

module.exports = { execute };
