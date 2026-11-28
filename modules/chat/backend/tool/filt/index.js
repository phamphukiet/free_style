// index.js
// Lọc lệnh bằng 1 lượt LLM (prompt cố định): agent chỉ rút { lệnh, tham số } từ danh sách lệnh đơn giản
// của mode. null / lỗi / không chắc → { handled: false } để chat tự do xử lý.
// Trả cùng dạng handleCommand cũ: { handled, content } (+ notice khi cần báo người dùng).

const { toSchema } = require("../../../../../shared/command/args.js");
const { createLog } = require("../../../../../shared/log");
const config = require("../../config");
const reply = require("../reply-format");
const { resolveEntities } = require("../resolve-entity");
const { candidatesOf, catalogOf } = require("./common/candidates");
const { execute } = require("./common/execute");
const { systemOf, retryText } = require("./prompt");
const { askRouter } = require("./ask");
const { verifyReply } = require("./verify");
const { outcomeOf } = require("./outcome");

const log = createLog({ filename: __filename, topic: "command" });

const PASS = Object.freeze({ handled: false, notice: "" });
const handled = (content) => ({ handled: true, content });

function toChat({ reason, notice = "" }) {
  log.say({ task: "Chat", message: reason });
  return { handled: false, notice };
}

async function classify({ system, text, prompt, commands, attempt }) {
  const asked = await askRouter({ system, text: prompt });
  const result = asked.ok ? verifyReply({ raw: asked.raw, commands }) : asked;
  const step = outcomeOf({ result, attempt, maxRetry: config.routerRetries });
  log.say({
    task: "Classify",
    message: `attempt=${attempt} ${step.action} ${step.reason}`,
  });
  if (step.action !== "retry") return { step, result };
  const again = retryText({ text, message: step.message });
  return classify({
    system,
    text,
    prompt: again,
    commands,
    attempt: attempt + 1,
  });
}

async function runResolved({ command, args }) {
  const schema = toSchema(command.args);
  const picked = await resolveEntities({ schema, values: args });
  if (picked.crowded) return handled(reply.crowded(picked.crowded));
  if (!picked.args)
    return toChat({ reason: `missing-target ${picked.missing}` });
  const done = await execute({
    command,
    args: picked.args,
    targets: picked.targets,
  });
  return handled(done.content);
}

const FINISH = {
  chat: ({ step }) => toChat(step),
  resolve: ({ result }) => runResolved(result),
};

async function route({ text, mode }) {
  const commands = candidatesOf({ mode, maxArgs: config.routerMaxArgs });
  if (commands.length === 0) return toChat({ reason: "no-commands" });
  const system = systemOf({ mode, commands, catalog: catalogOf() });
  const out = await classify({
    system,
    text,
    prompt: text,
    commands,
    attempt: 0,
  });
  return FINISH[out.step.action](out);
}

/** @param {{ text: string, mode: string }} args */
function runFilt({ text, mode }) {
  if (!mode) return Promise.resolve(PASS);
  return log.say({
    task: "Filter",
    message: text,
    run: () => route({ text, mode }),
    fallback: PASS,
  });
}

module.exports = { runFilt };
