// parse-table.js
// Đọc bảng GFM: dòng header, dòng phân cách (---|:--:), các dòng dữ liệu.

const SEPARATOR = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/;

const splitRow = (line) =>
  line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split(/(?<!\\)\|/)
    .map((cell) => cell.trim().replace(/\\\|/g, "|"));

function alignOf(cell) {
  const left = cell.startsWith(":");
  const right = cell.endsWith(":");
  if (left && right) return "center";
  return right ? "right" : "left";
}

export function isTableStart(lines, i) {
  const next = lines[i + 1];
  return (
    Boolean(next) &&
    lines[i].includes("|") &&
    next.includes("|") &&
    SEPARATOR.test(next)
  );
}

export function readTable(lines, i) {
  if (!isTableStart(lines, i)) return null;
  const rows = [];
  let j = i + 2;
  while (j < lines.length && lines[j].trim() && lines[j].includes("|"))
    rows.push(splitRow(lines[j++]));
  const node = {
    type: "table",
    head: splitRow(lines[i]),
    align: splitRow(lines[i + 1]).map(alignOf),
    rows,
  };
  return { node, next: j };
}
