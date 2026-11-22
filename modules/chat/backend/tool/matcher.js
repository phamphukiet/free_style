// matcher.js: tìm lệnh mà tin nhắn nhắc tới. Tên dài (cụ thể) thắng tên ngắn.
const { tokenize, normalizeWord } = require("./normalize");
const namesOf = (command) => [command.label, ...(command.aliases ?? [])];
const wordsOf = (name) => name.split(/\s+/).filter(Boolean).map(normalizeWord);

function runAt({ haystack, needle }) {
  const last = haystack.length - needle.length;
  for (let i = 0; i <= last; i++) {
    if (needle.every((word, k) => haystack[i + k] === word)) return i;
  }
  return -1;
}

function bestHit({ norm, command }) {
  const hits = namesOf(command)
    .map(wordsOf)
    .map((needle) => ({
      start: runAt({ haystack: norm, needle }),
      len: needle.length,
    }))
    .filter((hit) => hit.start >= 0 && hit.len > 0)
    .sort((a, b) => b.len - a.len);
  return hits[0] ?? null;
}

// Phần còn lại của câu sau khi bỏ đoạn tên lệnh.
const without = ({ tokens, start, len }) => {
  const keep = (_, i) => i < start || i >= start + len;
  return { raw: tokens.raw.filter(keep), norm: tokens.norm.filter(keep) };
};

/** @param {{ text: string, commands: object[] }} args */
function match({ text, commands }) {
  const tokens = tokenize(text);
  const hits = commands
    .map((command) => ({
      command,
      hit: bestHit({ norm: tokens.norm, command }),
    }))
    .filter((entry) => entry.hit);
  if (hits.length === 0) return { kind: "none" };
  const top = Math.max(...hits.map((e) => e.hit.len));
  const best = hits.filter((e) => e.hit.len === top);
  if (best.length > 1) {
    return { kind: "ambiguous", options: best.map((e) => e.command) };
  }
  const { command, hit } = best[0];
  return { kind: "hit", command, rest: without({ tokens, ...hit }) };
}

module.exports = { match };
