// set-value.js — user đổi giá trị 1 setting của ext. Kiểm tra theo khai báo trong code ext.

function checkValue({ def, value }) {
  if (def.type === "select") {
    return def.options.some((o) => o.value === value)
      ? null
      : "không nằm trong lựa chọn";
  }
  const ok =
    typeof value === def.type &&
    (def.type !== "number" || Number.isFinite(value));
  return ok ? null : `phải là ${def.type}`;
}

/** @param {{ catalog, settings, broadcast: Function }} deps */
function createSetValue({ catalog, settings, broadcast }) {
  return function setValue({ id, key, value }) {
    const defs = catalog.get({ id })?.manifest?.settings ?? [];
    const def = defs.find((d) => d.id === `${id}.${key}`);
    if (!def) throw new Error(`Extension "${id}" không có setting "${key}"`);
    const error = checkValue({ def, value });
    if (error) throw new Error(`${def.label}: ${error}`);
    settings.write({ id: def.id, value });
    broadcast();
  };
}

module.exports = { createSetValue };
