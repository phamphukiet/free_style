// rules.js
// Luật theo loại người gọi. Mặc định chặn. Quyết định: deny | ask | (null = chưa kết luận).

const { RISKS, AI_ACCESS } = require("../spec");

const rank = (risk) => RISKS.indexOf(risk) + 1; // thiếu/lạ = 0
const ceilingOf = (access) => Math.max(0, AI_ACCESS.indexOf(access));
const ASK_FROM = rank("destructive"); // destructive và exec luôn hỏi người dùng
const TAINT_FROM = rank("write");

const deny = (reason) => ({ decision: "deny", reason });
const ask = (reason) => ({ decision: "ask", reason });

const needsAsk = ({ cmd }) =>
  rank(cmd.risk) >= ASK_FROM
    ? ask(`Lệnh rủi ro "${cmd.risk}" cần người dùng xác nhận.`)
    : null;

const AI_RULES = [
  ({ cmd }) => (cmd.aiAccess === "none" ? deny("Lệnh không mở cho AI.") : null),
  ({ cmd }) =>
    rank(cmd.risk) > ceilingOf(cmd.aiAccess)
      ? deny(`Rủi ro "${cmd.risk}" vượt mức aiAccess "${cmd.aiAccess}".`)
      : null,
  needsAsk,
  ({ caller, cmd }) =>
    caller.tainted && rank(cmd.risk) >= TAINT_FROM
      ? ask("Lượt này AI đã đọc nội dung không tin cậy (file).")
      : null,
];

const EXT_RULES = [needsAsk];

module.exports = { AI_RULES, EXT_RULES, deny };