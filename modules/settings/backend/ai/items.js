// modules/settings/backend/ai/items.js
// Setting (engine.list) → item cho shared/command/list.js: { key, label, group, names, row }.
// Phần riêng của settings: tên để khớp, dạng hàng gọn cho AI, cách đếm khi không có query.

const MAX_OPTIONS = 10;

// Tên để khớp: nhãn, id, group và cả option (gõ "monokai" ra đúng theme).
function namesOf(def) {
  const options = (def.options || []).flatMap((o) => [
    o.label,
    String(o.value),
  ]);
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

const toItem = (entry) => ({
  key: entry.def.id,
  label: entry.def.label,
  group: entry.def.group,
  names: namesOf(entry.def),
  row: toRow(entry),
});

function groupCounts(items) {
  const counts = {};
  items.forEach(({ group }) => {
    counts[group] = (counts[group] || 0) + 1;
  });
  return counts;
}

/** @param {{ engine: object }} deps */
function createItems({ engine }) {
  return {
    getItems: () =>
      engine
        .list()
        .filter(({ def }) => def.aiAccess !== "none")
        .map(toItem),
    empty: (items) => ({ groups: groupCounts(items) }),
  };
}

module.exports = { createItems };
