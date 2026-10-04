// parse-list.js
// Đọc list (có/không thứ tự). Nội dung mỗi item được parse đệ quy thành block,
// nên list lồng nhau, đoạn văn và code block trong item đều chạy đúng.

const ITEM = /^(\s*)([-*+]|(\d{1,9})[.)])\s+(.*)$/;

const lineIndent = (line) => line.length - line.trimStart().length;

// Danh sách chỉ được ngắt đoạn văn khi là gạch đầu dòng hoặc bắt đầu từ "1".
export function isListStart(line) {
  const m = ITEM.exec(line);
  return Boolean(m) && (!m[3] || Number(m[3]) === 1);
}

function continues(lines, from, base) {
  let k = from;
  while (k < lines.length && !lines[k].trim()) k++;
  return k < lines.length && lineIndent(lines[k]) > base;
}

function takeBody(lines, from, base) {
  const body = [];
  let j = from;
  while (j < lines.length) {
    const blank = !lines[j].trim();
    const inside = blank
      ? continues(lines, j, base)
      : lineIndent(lines[j]) > base;
    if (!inside) break;
    body.push(lines[j++]);
  }
  return { body, next: j };
}

function dedent(first, rest) {
  const indents = rest.filter((l) => l.trim()).map(lineIndent);
  const cut = Math.min(...indents, Infinity);
  return [first, ...rest.map((l) => (l.trim() ? l.slice(cut) : ""))].join("\n");
}

function nextSibling(lines, from, base) {
  let k = from;
  while (k < lines.length && !lines[k].trim()) k++;
  const m = ITEM.exec(lines[k] ?? "");
  return m && m[1].length === base ? k : -1;
}

export function readList(lines, i, parse) {
  const head = ITEM.exec(lines[i]);
  if (!head) return null;
  const base = head[1].length;
  const items = [];
  let at = i;
  let end = i;
  while (at >= 0) {
    const m = ITEM.exec(lines[at]);
    const { body, next } = takeBody(lines, at + 1, base);
    items.push(parse(dedent(m[4], body)));
    end = next;
    at = nextSibling(lines, next, base);
  }
  const node = {
    type: "list",
    ordered: Boolean(head[3]),
    start: Number(head[3] || 1),
    items,
  };
  return { node, next: end };
}
