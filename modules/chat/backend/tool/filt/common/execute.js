// execute.js
// Chạy 1 lệnh đã đủ lệnh + tham số + đối tượng: xác nhận (danger) → chạy → câu trả lời mẫu.
// Trả dạng của tầng: { done: true, content }. Dùng chung cho mọi tầng.

const reply = require("../../reply-format");
const { createLog } = require("../../../../../../shared/log");
const log = createLog({ filename: __filename, topic: "command" });

const busRun = (call) =>
  require("../../../../../../shared/command").getBus().run(call);
const askLazy = (options) => require("../../confirm").askUser(options);

const say = (content) => ({ done: true, content });

async function confirmed({ command, targets, ask }) {
  if (!command.danger) return true;
  const detail = targets.map((t) => t.label).join("\n");
  return ask({ message: `${command.label}?`, detail });
}

async function runCommand({ command, args, run }) {
  const { module: moduleName, name } = command;
  log.say({
    task: "Run",
    message: `${moduleName}.${name} ${JSON.stringify(args)}`,
  });
  const result = await run({ module: moduleName, name, args });
  const sent = command.runIn === "renderer";
  return say(reply.done({ command, items: result?.items, sent }));
}

/** @param {{ command: object, args: object, targets?: object[], run?: Function, ask?: Function }} args */
async function execute({
  command,
  args,
  targets = [],
  run = busRun,
  ask = askLazy,
}) {
  try {
    if (!(await confirmed({ command, targets, ask }))) {
      return say(reply.cancelled());
    }
    return await runCommand({ command, args, run });
  } catch (error) {
    log.say({ task: "Error", message: error.stack });
    return say(reply.failed(error));
  }
}

module.exports = { execute };
