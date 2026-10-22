// migrate-legacy.js
// Chạy 1 lần: userData/settings-store.json (cũ) → engine mới, rồi đổi tên thành .migrated.
// Mẫu cũ có value là chuỗi JSON → chuyển thành { value: slug(label), label, data }.
// Giá trị không còn hợp lệ bị bỏ qua (về default). Setting "created" cũ KHÔNG chuyển
// (thay bằng extension ở giai đoạn sau).

const fs = require("fs");

const slug = (text) =>
  String(text ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const attempt = (fn) => {
  try {
    fn();
  } catch {
    /* giá trị cũ không còn hợp lệ: bỏ qua */
  }
};

function parseObject(text) {
  try {
    const value = JSON.parse(text);
    return value && typeof value === "object" ? value : null;
  } catch {
    return null;
  }
}

function readJson(file) {
  try {
    return parseObject(fs.readFileSync(file, "utf-8"));
  } catch {
    return null;
  }
}

function convertPreset({ id, preset, renames, addPreset }) {
  const data = parseObject(preset.value);
  if (!data) return;
  const { id: legacyId, ...clean } = data;
  const value = slug(preset.label) || slug(legacyId) || "preset";
  attempt(() => {
    addPreset({ id, option: { value, label: preset.label, data: clean } });
    renames[id][preset.value] = value;
  });
}

/** @param {{ file: string, set: Function, addPreset: Function }} args */
function migrateLegacy({ file, set, addPreset }) {
  if (!fs.existsSync(file)) return false;
  const legacy = readJson(file) || {};
  const renames = {};
  for (const [id, list] of Object.entries(legacy.presets || {})) {
    renames[id] = {};
    (list || []).forEach((preset) =>
      convertPreset({ id, preset, renames, addPreset }),
    );
  }
  for (const [id, value] of Object.entries(legacy.values || {})) {
    attempt(() =>
      set({ id, value: renames[id]?.[value] ?? value, scope: "global" }),
    );
  }
  fs.renameSync(file, `${file}.migrated`);
  return true;
}

module.exports = { migrateLegacy };
