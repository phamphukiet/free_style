// scan-commands.js
// Quét modules/<id>/backend/setting/command/*.js của các module đang bật.
// Mỗi file export { tênLệnh: { label, runIn, args?, run? } }. File lỗi bị bỏ qua, không làm sập quét.

const fs = require("fs");
const path = require("path");

const isDefs = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

function readFile({ file }) {
  try {
    const defs = require(file);
    return isDefs(defs) ? defs : {};
  } catch (error) {
    console.warn("[extension:commands]", file, error.message);
    return {};
  }
}

function readModule({ id, modulesDir }) {
  const dir = path.join(modulesDir, id, "backend", "setting", "command");
  if (!fs.existsSync(dir)) return {};
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".js"))
    .sort()
    .reduce(
      (all, name) =>
        Object.assign(all, readFile({ file: path.join(dir, name) })),
      {},
    );
}

/** @param {{ activeModules: string[], modulesDir: string }} args  → { [module]: { [lệnh]: def } } */
function scanCommands({ activeModules, modulesDir }) {
  const table = {};
  activeModules.forEach((id) => {
    const defs = readModule({ id, modulesDir });
    if (Object.keys(defs).length > 0) table[id] = defs;
  });
  return table;
}

module.exports = { scanCommands };
