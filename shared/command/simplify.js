// shared/command/simplify.js
// Agent nhỏ: câu của user → ["tên đối tượng", "giá trị"...] để findKeys tìm.
// Không đưa danh sách cho agent nên prompt cố định, dùng chung mọi module.

const { ask } = require("./ask");

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
  const pending = new Map(); // cùng câu đang chờ → dùng chung 1 request

  async function run({ text }) {
    try {
      return parse(await ask({ system: SYSTEM, text }));
    } catch (error) {
      console.error(`[Error - 'shared' - 'simplify.js']:`, error.message);
      return [];
    }
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
