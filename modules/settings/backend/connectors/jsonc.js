// jsonc.js
// Parse JSON có comment và dấu phẩy thừa (settings.json của VS Code).
// Regex ưu tiên khớp chuỗi trước nên không phá nội dung bên trong chuỗi.

const COMMENTS = /("(?:\\.|[^"\\])*")|\/\/[^\n]*|\/\*[\s\S]*?\*\//g;
const TRAILING = /("(?:\\.|[^"\\])*")|,(\s*[}\]])/g;

function parseJsonc(text) {
  const clean = text
    .replace(COMMENTS, (match, str) => str || "")
    .replace(TRAILING, (match, str, close) => str || close);
  return JSON.parse(clean);
}

module.exports = { parseJsonc };
