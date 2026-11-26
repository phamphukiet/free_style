// shared/command/list.js
// Tìm theo tên + liệt kê gọn. items: { key, label, names[], row }.
// Dùng chung cho mọi module (settings, extension, ...).

const { rank } = require("./rank");
const { createLog } = require("../log");
const log = createLog({ filename: __filename, topic: "command" });
const unique = (hits) => [...new Map(hits.map((h) => [h.key, h])).values()];

// Từ khóa sau (giá trị) chỉ thu hẹp trong kết quả của từ khóa đầu; rỗng thì giữ nguyên.
function narrow({ items, hits, values }) {
  const keys = new Set(hits.map((h) => h.key));
  const pool = items.filter((item) => keys.has(item.key));
  const kept = unique(values.flatMap((text) => rank({ items: pool, text })));
  return kept.length > 0 ? kept : hits;
}

/** @param {{ items: object[], text: string, simplify?: Function }} args */
async function findKeys({ items, text, simplify }) {
  const direct = rank({ items, text });
    log.say({
      task: "Rank",
      message: `"${text}" -> ${direct.length} direct hit(s)`,
    });
  if (direct.length > 0 || !simplify) return direct;
  const [name, ...values] = await simplify({ text });
  if (!name) return [];
  const hits = rank({ items, text: name });
  return hits.length > 1 ? narrow({ items, hits, values }) : hits;
}

/**
 * @param {{ getItems: () => object[], empty: (items: object[]) => object,
 *           simplify?: Function, max?: number }} deps
 * empty: phần trả về khi không có query / không khớp (VD đếm theo group).
 */
function createLister({ getItems, empty, simplify, max = 5 }) {
  return async function list({ query } = {}) {
    const items = getItems();
    if (!query) return empty(items);
    const hits = await findKeys({ items, text: query, simplify });
    const keys = new Set(hits.map((h) => h.key));
    const rows = items.filter((i) => keys.has(i.key)).map((i) => i.row);
    if (rows.length === 0) return { items: [], ...empty(items) };
    const result = { items: rows.slice(0, max) };
    if (rows.length > max) result.more = rows.length - max;
    return result;
  };
}

module.exports = { findKeys, createLister };
