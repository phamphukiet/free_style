// index.js
// Source: { id, builtin, list(): [{ from, manifest, entryFile? } | { from, error }] }.
// Module dựng sẵn luôn đứng đầu; feature thêm sau bằng add().

const { createModulesSource } = require("./modules");

function createSources({ activeModules, modulesDir }) {
  const sources = [createModulesSource({ activeModules, modulesDir })];
  return {
    list: () => sources,
    add: (source) => {
      sources.push(source);
    },
  };
}

module.exports = { createSources };
