const activeModules = require("../../../active-modules.js");

function loadBridge(id) {
  try {
    return require(`../../../${id}/backend/tool-bridge.js`);
  } catch {
    return null;
  }
}

function getToolSpecs(priorityNames = []) {
  const specs = activeModules
    .map(loadBridge)
    .filter(Boolean)
    .map((b) => b.getToolSpec());
  if (priorityNames.length === 0) return specs;
  return [...specs].sort(
    (a, b) => priorityNames.includes(b.name) - priorityNames.includes(a.name),
  );
}

async function executeAiTool(name, args, ctx = {}) {
  if (!activeModules.includes(name))
    throw new Error(`Tool "${name}" không tồn tại`);
  const bridge = loadBridge(name);
  if (!bridge) throw new Error(`Tool "${name}" không tồn tại`);
  return bridge.execute(args, ctx);
}

module.exports = { getToolSpecs, executeAiTool };
