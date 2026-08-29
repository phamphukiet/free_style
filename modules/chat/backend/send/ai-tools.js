// ai-tools.js
// Gom tool-spec + dispatcher của các module hỗ trợ AI function-calling
// (settings, rule...). Thêm module tool mới chỉ cần thêm 1 nhánh ở đây,
// không phải sửa gemini-client.js hay send-handler.js.

const { loadSettingsBridge } = require("./resolve.js");

function loadRuleBridge() {
  try {
    return require("../../../rule/backend/tool-bridge.js");
  } catch {
    return null;
  }
}

function getToolSpecs() {
  const specs = [];
  const settingsBridge = loadSettingsBridge();
  if (settingsBridge) specs.push(settingsBridge.getToolSpec());
  const ruleBridge = loadRuleBridge();
  if (ruleBridge) specs.push(ruleBridge.getToolSpec());
  return specs;
}

async function executeAiTool(name, args, { agentId, notify } = {}) {
  if (name === "settings") {
    const bridge = loadSettingsBridge();
    if (!bridge) throw new Error("Settings module không khả dụng");
    return bridge.execute(args.action, args);
  }

  if (name === "rule") {
    const bridge = loadRuleBridge();
    if (!bridge) throw new Error("Rule module không khả dụng");
    const result = bridge.execute(args.action, args, agentId);
    if (notify && ["create", "update", "delete"].includes(args.action)) {
      notify({ type: "rule", action: args.action, ...result });
    }
    return result;
  }

  throw new Error(`Tool "${name}" không tồn tại`);
}

module.exports = { getToolSpecs, executeAiTool };
