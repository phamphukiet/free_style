// parse-blocks.js
// Markdown -> mảng block (heading, paragraph, code, quote, list, table, hr).
// Mỗi reader nhận (lines, i, parse) và trả { node, next } hoặc null.

import { readList, isListStart } from "./parse-list.js";
import { readTable, isTableStart } from "./parse-table.js";

const FENCE = /^\s{0,3}(`{3,}|~{3,})(.*)$/;
const HEADING = /^\s{0,3}(#{1,6})\s+(.+?)\s*$/;
const HR = /^\s{0,3}([-*_])(\s*\1){2,}\s*$/;
const QUOTE = /^\s{0,3}>/;

function matchFence(line) {
  const m = FENCE.exec(line);
  if (!m) return null;
  return m[1][0] === "`" && m[2].includes("`") ? null : m;
}

const isFenceEnd = (line, mark) => {
  const t = line.trim();
  return t.length >= mark.length && t === mark[0].repeat(t.length);
};

function readFence(lines, i) {
  const open = matchFence(lines[i]);
  if (!open) return null;
  const body = [];
  let j = i + 1;
  while (j < lines.length && !isFenceEnd(lines[j], open[1]))
    body.push(lines[j++]);
  const lang = open[2].trim().split(/\s+/)[0];
  return { node: { type: "code", lang, text: body.join("\n") }, next: j + 1 };
}

function readHeading(lines, i) {
  const m = HEADING.exec(lines[i]);
  if (!m) return null;
  return {
    node: { type: "heading", level: m[1].length, text: m[2] },
    next: i + 1,
  };
}

function readHr(lines, i) {
  return HR.test(lines[i]) ? { node: { type: "hr" }, next: i + 1 } : null;
}

function readQuote(lines, i, parse) {
  if (!QUOTE.test(lines[i])) return null;
  const inner = [];
  let j = i;
  while (j < lines.length && QUOTE.test(lines[j]))
    inner.push(lines[j++].replace(/^\s{0,3}>\s?/, ""));
  return { node: { type: "quote", blocks: parse(inner.join("\n")) }, next: j };
}

function startsBlock(lines, i) {
  const line = lines[i];
  return (
    Boolean(matchFence(line)) ||
    HEADING.test(line) ||
    HR.test(line) ||
    QUOTE.test(line) ||
    isListStart(line) ||
    isTableStart(lines, i)
  );
}

function readParagraph(lines, i) {
  const body = [lines[i]];
  let j = i + 1;
  while (j < lines.length && lines[j].trim() && !startsBlock(lines, j))
    body.push(lines[j++]);
  return { node: { type: "paragraph", text: body.join("\n") }, next: j };
}

const READERS = [
  readFence,
  readHeading,
  readHr,
  readQuote,
  readTable,
  readList,
  readParagraph,
];

function firstHit(lines, i) {
  for (const read of READERS) {
    const hit = read(lines, i, parseBlocks);
    if (hit) return hit;
  }
}

export function parseBlocks(text) {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    if (!lines[i].trim()) {
      i++;
      continue;
    }
    const { node, next } = firstHit(lines, i);
    blocks.push(node);
    i = next;
  }
  return blocks;
}
