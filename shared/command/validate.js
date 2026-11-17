// validate.js
// Kiểm lệnh đã chuẩn hoá. Mỗi rule trả null (hợp lệ) hoặc chuỗi lỗi.

const { RISKS, AI_ACCESS, RUN_IN, ARG_TYPES, ID_PATTERN } = require("./spec");

const isText = (v) => typeof v === "string" && v.trim() !== "";
const isPlain = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

function runRule({ command }) {
  const hasRun = typeof command.run === "function";
  if (command.runIn === "main" && !hasRun) return "runIn=main cần run là hàm";
  if (command.runIn === "renderer" && command.run !== undefined) {
    return "runIn=renderer không được có run";
  }
  return null;
}

function argsRule({ command }) {
  const { args } = command;
  if (!isPlain(args) || !isPlain(args.properties)) return "args không hợp lệ";
  const badType = Object.entries(args.properties).find(
    ([, prop]) => !ARG_TYPES.includes(prop?.type),
  );
  if (badType) return `args.${badType[0]}: type không hợp lệ`;
  const required = args.required ?? [];
  if (!Array.isArray(required)) return "args.required phải là mảng";
  const unknown = required.find((k) => !Object.hasOwn(args.properties, k));
  return unknown ? `required "${unknown}" không có trong properties` : null;
}

const RULES = [
  ({ command }) =>
    ID_PATTERN.test(command.id) ? null : "id sai định dạng module.tên",
  ({ command }) => (isText(command.label) ? null : "thiếu label"),
  ({ command }) =>
    RUN_IN.includes(command.runIn) ? null : "runIn phải là main hoặc renderer",
  runRule,
  ({ command }) =>
    command.risk === undefined || RISKS.includes(command.risk)
      ? null
      : "risk không hợp lệ",
  ({ command }) =>
    AI_ACCESS.includes(command.aiAccess) ? null : "aiAccess không hợp lệ",
  ({ command }) =>
    command.aiAccess !== "none" && command.risk === undefined
      ? "lệnh mở cho AI bắt buộc khai báo risk"
      : null,
  argsRule,
];

function validateCommand({ command }) {
  for (const rule of RULES) {
    const error = rule({ command });
    if (error) return `${command.id}: ${error}`;
  }
  return null;
}

module.exports = { validateCommand };
