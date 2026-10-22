// modules.js
// Quét modules/<id>/backend/setting/manifest.js của các module đang bật.
// manifest.js export 1 manifest hoặc 1 mảng manifest. Module bị đóng băng → tự biến mất.

const fs = require("fs");
const path = require("path");

function loadOne({ id, modulesDir }) {
  const file = path.join(modulesDir, id, "backend", "setting", "manifest.js");
  if (!fs.existsSync(file)) return [];
  try {
    return [].concat(require(file)).map((manifest) => ({ from: id, manifest }));
  } catch (error) {
    return [{ from: id, error: error.message }];
  }
}

function createModulesSource({ activeModules, modulesDir }) {
  return {
    id: "module",
    trusted: true,
    list: () => activeModules.flatMap((id) => loadOne({ id, modulesDir })),
  };
}

module.exports = { createModulesSource };