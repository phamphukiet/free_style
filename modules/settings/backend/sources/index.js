// index.js
// Gom các source theo thứ tự tin cậy giảm dần. Thêm source = thêm 1 dòng.
// Giao diện source: { id, trusted, list(): [{ from, manifest } | { from, error }] }.

const { createModulesSource } = require("./modules");
const { createExtensionsSource } = require("./extensions-dir");

function createSources({ activeModules, modulesDir, extensionsDir }) {
  const sources = [
    createModulesSource({ activeModules, modulesDir }),
    createExtensionsSource({ extensionsDir }),
  ];
  return () => sources;
}

module.exports = { createSources };
