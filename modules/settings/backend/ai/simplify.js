// simplify.js — agent nhỏ: câu của user → vài từ khóa để list tìm setting.
// Không đưa danh sách setting cho agent → prompt cố định, không phình theo module.
// `ask` do bên ngoài truyền vào: ({ system, text }) => Promise<string>.

const MAX_KEYWORDS = 3;
const SYSTEM =
  "Bạn rút từ khóa tìm cấu hình của một ứng code. Tối đa " +
  MAX_KEYWORDS + " từ khóa. " +
  'Ví dụ: "đổi cỡ chữ thành 14" -> ["font size", "14"]';

function parse(raw) {
  const text = String(raw)
    .replace(/```json|```/g, "")
    .trim();
  const list = JSON.parse(text);
  if (!Array.isArray(list)) return [];
  return list
    .filter((k) => typeof k === "string" && k.trim())
    .map((k) => k.trim())
    .slice(0, MAX_KEYWORDS);
}

/** @param {{ ask: Function }} deps */
function createSimplifier({ ask }) {
  return async function simplify({ text }) {
    try {
      return parse(await ask({ system: SYSTEM, text }));
    } catch (error) {
      console.error(`[Error - 'settings' - 'simplify.js']:`, error.message);
      return [];
    }
  };
}

module.exports = { createSimplifier };
