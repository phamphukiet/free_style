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
const { listQuickCommands } = require("./settings-quick");
const PASS = Object.freeze({ handled: false });
const say = (content) => ({ handled: true, content });

function commandsOf({ mode }) {
  const modules = modulesOfMode(mode);
  return [...getBus().list(), ...listQuickCommands()].filter((command) =>
    modules.includes(command.module),
  );
}

async function execute({ command, args, targets }) {
  if (command.danger) {
    const detail = targets.map((t) => t.label).join("\n");
    if (!(await askUser({ message: `${command.label}?`, detail }))) {
      return say(reply.cancelled());
    }
  }
    const { module: moduleName, name } = command;
    const result = command.run
      ? await command.run(args)
      : await getBus().run({ module: moduleName, name, args, confirmed: true });
  const sent = command.runIn === "renderer";
  return say(reply.done({ command, items: result?.items, sent }));
}

/** @param {{ text: string, mode: string }} args */
async function handleCommand({ text, mode }) {
  if (!mode) return PASS;
  try {
    const found = match({ text, commands: commandsOf({ mode }) });
    if (found.kind === "none") return PASS;
    if (found.kind === "ambiguous")
      return say(reply.pickCommand(found.options));
    const schema = toSchema(found.command.args);
    const filled = fill({ rest: found.rest, schema });
    if (filled.error) return PASS;
    const resolved = await resolveEntities({ schema, values: filled.values });
    if (resolved.crowded) return say(reply.crowded(resolved.crowded));
    if (resolved.missing) return PASS;
    return await execute({ command: found.command, ...resolved });
  } catch (error) {
    console.error(`[chat - error] handleCommand:`, error.stack);
    return say(reply.failed(error));
  }
}

module.exports = { handleCommand };
