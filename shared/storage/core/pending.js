// Bộ đệm thay đổi chờ ghi: gom insert/remove, hoàn lại khi ghi lỗi.

function createPending() {
  let inserts = new Map();
  let removes = new Set();

  const has = () => inserts.size > 0 || removes.size > 0;
  const touched = (key) => inserts.has(key) || removes.has(key);

  function insert({ key, value }) {
    inserts.set(key, value);
    removes.delete(key);
  }

  function remove({ key }) {
    inserts.delete(key);
    removes.add(key);
  }

  function take() {
    const batch = { insert: Object.fromEntries(inserts), remove: [...removes] };
    inserts = new Map();
    removes = new Set();
    return batch;
  }

  // Ghi lỗi: trả lại phần chưa bị thay đổi mới hơn đè lên.
  function restore({ batch }) {
    Object.entries(batch.insert).forEach(([key, value]) => {
      if (!touched(key)) inserts.set(key, value);
    });
    batch.remove.forEach((key) => {
      if (!touched(key)) removes.add(key);
    });
  }

  return { has, insert, remove, take, restore };
}

module.exports = { createPending };
