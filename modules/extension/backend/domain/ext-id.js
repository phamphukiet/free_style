// ext-id.js
// Chuẩn hóa tên user nhập thành id (bất biến sau khi tạo), chọn id không trùng.

const PATTERN = /^[a-z][a-z0-9-]*$/; // khớp OWNER_PATTERN của settings

const isValidId = (id) => typeof id === "string" && PATTERN.test(id);

function slug(text) {
  return String(text ?? "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function baseId({ name }) {
  const text = slug(name);
  return /^[a-z]/.test(text) ? text : slug(`ext-${text}`);
}

/** @param {{ name: string, taken: Set<string> }} args */
function pickUniqueId({ name, taken }) {
  const base = baseId({ name });
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

module.exports = { slug, isValidId, pickUniqueId };
