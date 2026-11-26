// handle-command.js
// Điều phối: khớp lệnh → lấy tham số → tìm đối tượng → (xác nhận) → chạy → câu trả lời mẫu.
// Trả { handled:false } khi không chắc → handle-send cho agent xử lý như cũ.

const { getBus } = require("../../../../shared/command");
const { toSchema } = require("../../../../shared/command/args.js");
const { match } = require("./matcher");
const { fill } = require("./split-names");
const { resolveEntities } = require("./resolve-entity");
const { askUser } = require("./confirm");
const { modulesOfMode } = require("./modes");
const reply = require("./reply-format");
const { createLog } = require("../../../../shared/log");
const log = createLog({ filename: __filename, topic: "command" });

const PASS = Object.freeze({ handled: false });
const say = (content) => ({ handled: true, content });

const commandsOf = ({ mode }) => {
  const modules = modulesOfMode(mode);
  return getBus()
    .list()
    .filter((command) => modules.includes(command.module));
};

async function execute({ command, args, targets }) {
  if (command.danger) {
    const detail = targets.map((t) => t.label).join("\n");
    if (!(await askUser({ message: `${command.label}?`, detail }))) {
      return say(reply.cancelled());
    }
  }
  const { module: moduleName, name } = command;
    log.say({
      task: "Run",
      message: `${moduleName}.${name} ${JSON.stringify(args)}`,
    });
  const result = command.run
    ? await command.run(args)
    : await getBus().run({ module: moduleName, name, args, confirmed: true });
  const sent = command.runIn === "renderer";
  return say(reply.done({ command, items: result?.items, sent }));
}

// Điền tham số + tìm đối tượng cho 1 lệnh.
// Trả { command, args, targets } | { command, missing } | { command, crowded } | { command } (không điền được).
async function tryResolve({ command, rest }) {
  const schema = toSchema(command.args);
  const filled = fill({ rest, schema });
    log.say({
      task: "Fill",
      message: `${command.module}.${command.name} ${JSON.stringify(filled)}`,
    });
  if (filled.error) return { command };
  const resolved = await resolveEntities({ schema, values: filled.values });
  return { command, ...resolved };
}

async function handleHit({ command, rest }) {
  const got = await tryResolve({ command, rest });
  if (got.crowded) return say(reply.crowded(got.crowded));
  return got.args ? execute(got) : PASS;
}

// Nhiều lệnh cùng khớp (VD "tắt" của settings và extension): lệnh nào tìm ra đối tượng thì chạy.
// Đúng 1 lệnh tìm ra → chạy. Nhiều lệnh tìm ra → hỏi lại. Không lệnh nào → để agent xử lý.
async function handleAmbiguous({ candidates }) {
  const results = await Promise.all(candidates.map(tryResolve));
  const ready = results.filter((got) => got.args);
  if (ready.length === 1) return execute(ready[0]);
  if (ready.length === 0) return PASS;
  return say(reply.pickCommand(ready.map((got) => got.command)));
}

/** @param {{ text: string, mode: string }} args */
async function handleCommand({ text, mode }) {
  if (!mode) return PASS;
  try {
    const found = match({ text, commands: commandsOf({ mode }) });
        log.say({ task: "Match", message: `${found.kind} "${text}"` });
    if (found.kind === "none") return PASS;
    if (found.kind === "ambiguous") return await handleAmbiguous(found);
    return await handleHit(found);
  } catch (error) {
    log.say({ task: "Error", message: error.stack });
    return say(reply.failed(error));
  }
}

module.exports = { handleCommand };
