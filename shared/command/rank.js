// rank.js
// items: { key, label, names[] }. Nhóm khớp tốt nhất có kết quả thì dừng:
// trùng hệt tên → chứa chuỗi. Trả { key, label }[].

const { fold } = require("./fold");

const TIERS = [
  (name, needle) => name === needle,
  (name, needle) => name.includes(needle),
];

/** @param {{ items: object[], text: string, limit?: number }} args */
function rank({ items, text, limit = 8 }) {
  const needle = fold(text).trim();
  if (!needle) return [];
  const folded = items.map((item) => ({ item, names: item.names.map(fold) }));
  for (const test of TIERS) {
    const hits = folded
      .filter(({ names }) => names.some((name) => test(name, needle)))
      .map(({ item }) => ({ key: item.key, label: item.label }));
    if (hits.length > 0) return hits.slice(0, limit);
  }
  return [];
}

module.exports = { rank };
