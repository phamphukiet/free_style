// verify.js
// Kiểm tra câu trả lời của agent: JSON hợp lệ, lệnh nằm trong danh sách, tham số đúng kiểu.
// Trả { ok:true, command, args } | { ok:false, kind:"none" } | { ok:false, kind:"fixable", message }.

const {
  toSchema,
  argsError,
} = require("../../../../../shared/command/args.js");

const fixable = (message) => ({ ok: false, kind: "fixable", message });
const idOf = (command) => `${command.module}.${command.name}`;
const asList = (value) => (Array.isArray(value) ? value : [value]);

function parse(raw) {
  const found = /\{[\s\S]*\}/.exec(String(raw ?? ""));
  if (!found) return { error: "reply has no JSON object" };
  try {
    return { value: JSON.parse(found[0]) };
  } catch (error) {
    return { error: `reply is not valid JSON (${error.message})` };
  }
}

function coerceOne({ spec, value }) {
  const cast = (item) => (spec.type === "string" ? String(item) : item);
  return spec.many ? asList(value).map(cast) : cast(value);
}

// Agent hay trả chuỗi cho tham số list, hoặc số cho tham số chuỗi: sửa nhẹ, không coi là lỗi.
function coerce({ command, args }) {
  const out = Object.fromEntries(
    Object.entries(args).filter(([, value]) => value != null),
  );
  for (const [key, spec] of Object.entries(toSchema(command.args)))
    if (out[key] !== undefined) out[key] = coerceOne({ spec, value: out[key] });
  return out;
}

const isPlain = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

/** @param {{ raw: string, commands: object[] }} args */
function verifyReply({ raw, commands }) {
  const parsed = parse(raw);
  if (parsed.error) return fixable(parsed.error);
  const { command: id, args = {} } = parsed.value;
  if (id === null) return { ok: false, kind: "none" };
  const command = commands.find((c) => idOf(c) === id);
  if (!command) {
    const valid = commands.map(idOf).join(", ");
    return fixable(
      `command "${id}" is not in the list. Valid: ${valid}, or null`,
    );
  }
  if (!isPlain(args)) return fixable("args must be an object");
  const fixed = coerce({ command, args });
  const error = argsError({ schema: command.args, args: fixed });
  return error
    ? fixable(`${id}: ${error}`)
    : { ok: true, command, args: fixed };
}

module.exports = { verifyReply };
