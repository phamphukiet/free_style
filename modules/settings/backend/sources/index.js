// Module (trusted) luôn đứng trước → extension không chiếm được owner/id của module.
// Source ngoài (extension...) lấy từ capability "setting-source" — settings không biết ai cung cấp.

const {
  listCapabilities,
} = require("../../../../shared/core/capability-registry.js");
const { createModulesSource } = require("./modules");

function createSources({ activeModules, modulesDir, extensionsDir }) {
  const sources = [
    createModulesSource({ activeModules, modulesDir }),
    createExtensionsSource({ extensionsDir }),
  ];
  return () => sources;
}

module.exports = { createSources };
