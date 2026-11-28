// prompt.js
// System prompt cố định (kiểu simplify.js). Chỉ liệt kê lệnh đơn giản của mode.
// Lệnh có tham số "generated" (agent tự viết, VD code ext) kéo theo hợp đồng + danh mục lệnh ext được gọi.

const { toSchema } = require("../../../../../shared/command/args.js");

const HEAD = `You route one chat message to one app command. Reply with a single JSON object and nothing else.
Format: {"command":"module.name","args":{...}} or {"command":null}`;

const RULES = `Rules:
- Choose a command only if the message clearly asks for it and gives every required argument.
- Argument values are the user's own words (names, values), never ids you invent. Exception: an argument marked "YOU WRITE THIS" is content you produce.
- If the user wants a feature the app lacks and a command can create an extension for it, write the extension using ONLY the commands listed under "Commands an extension may call". If a needed command is missing, or for questions or any doubt: {"command":null}.
- Reply with JSON only. Escape newlines inside strings as \\n.`;

function argText([key, spec]) {
  const base = spec.entity ? `name of ${spec.entity}` : spec.type;
  const kind = spec.many ? `list of ${base}` : base;
  const mine = spec.generated ? ` - YOU WRITE THIS: ${spec.generated}` : "";
  return `${key}: ${kind}${spec.optional ? " (optional)" : ""}${mine}`;
}

function lineOf(command) {
  const args = Object.entries(toSchema(command.args)).map(argText).join("; ");
  const danger = command.danger ? " [destructive]" : "";
  return `- ${command.module}.${command.name}: ${command.label}${danger} | args: ${args || "none"}`;
}

const writes = (command) =>
  Object.values(toSchema(command.args)).some((spec) => spec.generated);

// Hợp đồng + danh mục chỉ xuất hiện khi có lệnh cần agent viết nội dung.
function extraOf({ commands, catalog }) {
  const writers = commands.filter(writes);
  if (writers.length === 0) return [];
  const guides = [...new Set(writers.map((c) => c.guide).filter(Boolean))];
  return [
    "Extension guide:",
    ...guides,
    "Commands an extension may call:",
    ...catalog,
  ];
}

const systemOf = ({ mode, commands, catalog = [] }) =>
  [
    HEAD,
    `Mode: ${mode}`,
    "Commands:",
    ...commands.map(lineOf),
    ...extraOf({ commands, catalog }),
    RULES,
  ].join("\n");

const retryText = ({ text, message }) =>
  `${text}\n\n(Your previous reply was rejected: ${message}. Reply again with one valid JSON object only.)`;

module.exports = { systemOf, retryText };
