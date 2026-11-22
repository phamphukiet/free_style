// normalize.js: tách câu thành từ; norm = bỏ dấu + đổi từ đồng nghĩa, raw giữ nguyên.
const { fold } = require("../../../../shared/command/fold.js");
const SYNONYMS = require("./synonyms");

const trimEdge = (word) => word.replace(/^[,;:!?"']+|[,;:!?"']+$/g, "");

function normalizeWord(word) {
  const base = fold(trimEdge(word));
  return Object.hasOwn(SYNONYMS, base) ? SYNONYMS[base] : base;
}

function tokenize(text) {
  const raw = String(text ?? "")
    .split(/\s+/)
    .filter(Boolean);
  return { raw, norm: raw.map(normalizeWord) };
}

module.exports = { normalizeWord, tokenize };
