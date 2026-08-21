// loader.js
// Trách nhiệm duy nhất: gom toàn bộ định nghĩa setting thành 1 danh sách phẳng.
// Root: đọc file .js thật trong source/root/** (kỹ sư viết tay, chỉ định nghĩa schema).
// Create: đọc từ store (JSON, do user/AI tạo runtime) — không phải file .js,
// tránh phải eval code tuỳ ý lúc tạo setting mới.

const fs = require("fs");
const path = require("path");
const store = require("./store");

const ROOT_DIR = path.join(__dirname, "..", "source", "root");

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith(".js") ? [full] : [];
  });
}

function loadRootDefs() {
  return walk(ROOT_DIR)
    .filter((f) => !f.endsWith("-apply.js") && !f.endsWith("-ai.js"))
    .map((file) => {
      delete require.cache[require.resolve(file)];
      return { ...require(file), origin: "root" };
    });
}

function loadCreateDefs() {
  return Object.values(store.getCreated()).map((def) => ({
    ...def,
    origin: "create",
  }));
}

function loadAll() {
  const defs = [...loadRootDefs(), ...loadCreateDefs()];
  return defs.map((def) => {
    const storedValue = store.getValue(def.id);
    const extraPresets = store.getPresets(def.id);
    return {
      ...def,
      value: storedValue !== undefined ? storedValue : def.default,
      options: def.options ? [...def.options, ...extraPresets] : undefined,
    };
  });
}

function loadRootAiExtensions() {
  walk(ROOT_DIR)
    .filter((f) => f.endsWith("-ai.js"))
    .forEach((file) => {
      delete require.cache[require.resolve(file)];
      require(file);
    });
}

module.exports = { loadAll, loadRootAiExtensions };
