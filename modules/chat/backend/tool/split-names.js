// split-names.js: từ phần còn lại của câu → giá trị cho tham số lệnh.
// 1 tham số: cả câu là danh sách tên. 2 tham số: tách ở "vào/sang/to".
// Trả { values } hoặc { error } (error = không chắc, để câu đi tiếp xuống agent).

const { normalizeWord } = require("./normalize");

const JOIN = new Set(["va", "and", "&"]);
const TO = new Set(["vao", "sang", "to", "into"]);
const FILLER = new Set([
  "file",
  "folder",
  "ext",
  "cac",
  "nhung",
  "giup",
  "toi",
  "muon",
  "nhe",
  "thu",
  "muc",
  "sang",
  "thanh",
]);
const MAX_EXTRA_WORDS = 3; // lệnh không tham số: thừa quá nhiều chữ = có lẽ là câu khác

function trimFiller(words) {
  let i = 0;
  while (i < words.length && FILLER.has(normalizeWord(words[i]))) i++;
  return words.slice(i);
}

function namesOf(words) {
  const groups = [[]];
  for (const word of words) {
    const clean = word.replace(/[,;]+$/, "");
    if (JOIN.has(normalizeWord(clean))) groups.push([]);
    else if (clean) groups.at(-1).push(clean);
    if (clean !== word) groups.push([]);
  }
  return groups.map((g) => trimFiller(g).join(" ")).filter(Boolean);
}

function splitAtTo(words) {
  const at = words.findIndex((w) => TO.has(normalizeWord(w)));
  return at < 0 ? null : [words.slice(0, at), words.slice(at + 1)];
}

function assign({ key, spec, words }) {
  const names = namesOf(words);
  if (names.length === 0) return { error: `thiếu ${key}` };
  if (spec.type !== "string") return { error: `chưa hỗ trợ kiểu ${spec.type}` };
  if (!spec.entity && names.some((n) => /\s/.test(n)))
    return { error: "tên không hợp lệ" };
  if (!spec.many && names.length > 1)
    return { error: `${key} chỉ nhận 1 giá trị` };
  return { value: spec.many ? names : names[0] };
}

/** @param {{ rest: { raw: string[] }, schema: object }} args */
function fill({ rest, schema }) {
  const keys = Object.keys(schema);
  if (keys.length === 0) {
    return rest.raw.length <= MAX_EXTRA_WORDS
      ? { values: {} }
      : { error: "thừa chữ" };
  }
  if (keys.length > 2) return { error: "quá nhiều tham số" };
  const parts = keys.length === 1 ? [rest.raw] : splitAtTo(rest.raw);
  if (!parts) return { error: "thiếu từ nối" };
  const values = {};
  for (const [i, key] of keys.entries()) {
    const got = assign({ key, spec: schema[key], words: parts[i] });
    if (got.error) return got;
    values[key] = got.value;
  }
  return { values };
}

module.exports = { fill };
