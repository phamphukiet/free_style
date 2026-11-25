// list.js — action "list" của tool settings.
// Có query: trả setting khớp (nhãn kèm group, select kèm giá trị option).
// Không query / không khớp: chỉ trả tên group + số lượng → độ dài không tăng theo số module.

const { rank } = require("../../../../shared/command/rank.js");
const MAX_ROWS = 5;
const MAX_OPTIONS = 10;

// Tên để khớp: nhãn, id, group và cả option (gõ "monokai" ra đúng theme).
function namesOf(def) {
  const options = (def.options || []).flatMap((o) => [o.label, String(o.value)]);
  return [def.label, def.id, def.group, ...options];
}

function toRow({ def, value }) {
  const row = {
    id: def.id,
    label: `${def.group} · ${def.label}`,
    type: def.type,
    value,
  };
  if (def.type === "select") {
    row.options = def.options.slice(0, MAX_OPTIONS).map((o) => o.value);
  }
  return row;
}

function groupCounts(items) {
  const counts = {};
  items.forEach(({ def }) => {
    counts[def.group] = (counts[def.group] || 0) + 1;
  });
  return counts;
}

function findIds({ items, texts }) {
  const searchable = items.map(({ def }) => ({
    key: def.id,
    label: def.label,
    names: namesOf(def),
  }));
  const ids = new Set();
  texts.forEach((text) =>
    rank({ items: searchable, text }).forEach((hit) => ids.add(hit.key)),
  );
  return ids;
}

function createLister({ engine, simplify }) {
  return async function list({ query } = {}) {
    const items = engine.list().filter(({ def }) => def.aiAccess !== "none");
    if (!query) {
      return { groups: groupCounts(items), note: "Thêm query để xem setting." };
    }
    let ids = findIds({ items, texts: [query] });
    if (ids.size === 0 && simplify) {
      ids = findIds({ items, texts: await simplify({ text: query }) });
    }
    const rows = items.filter(({ def }) => ids.has(def.id)).map(toRow);
    if (rows.length === 0) return { items: [], groups: groupCounts(items) };
    const result = { items: rows.slice(0, MAX_ROWS) };
    if (rows.length > MAX_ROWS) result.more = rows.length - MAX_ROWS;
    return result;
  };
}

module.exports = { createLister };