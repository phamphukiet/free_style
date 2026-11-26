// shared/command/simplify.js
// Agent nhỏ: câu của user → ["tên đối tượng", "giá trị"...] để findKeys tìm.
// Không đưa danh sách cho agent nên prompt cố định, dùng chung mọi module.

const { ask } = require("./ask");
const { createLog } = require("../log");
const log = createLog({ filename: __filename, topic: "command" });
const SYSTEM = `Rút yêu cầu thành keywords, tiếng Anh: tên đối tượng trước, giá trị sau. VD:
"mở auto save" -> ["auto-save", "on"]
"đổi cỡ chữ thành 14" -> ["font size", "14"]`;

function parse(raw) {
  const text = String(raw)
    .replace(/```json|```/g, "")
    .trim();
  const list = JSON.parse(text);
  if (!Array.isArray(list)) return [];
  return list
    .filter((k) => typeof k === "string" && k.trim())
    .map((k) => k.trim())
    .slice(0, 3);
}

function createSimplifier({ ask }) {
  const pending = new Map();

    async function run({ text }) {
      const keywords = await log.say({
        task: "Simplify",
        message: text,
        run: async () => parse(await ask({ system: SYSTEM, text })),
        fallback: [],
      });
      log.say({ task: "Keywords", message: JSON.stringify(keywords) });
      return keywords;
    }

  return function simplify({ text }) {
    if (!pending.has(text)) {
      pending.set(
        text,
        run({ text }).finally(() => pending.delete(text)),
      );
    }
    return pending.get(text);
  };
}

module.exports = { createSimplifier, simplify: createSimplifier({ ask }) };
