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
function loadAgentBridge() {
  try {
    return require("../../../agent/backend/tool/index.js");
  } catch {
    return null;
  }
}

function loadFilesBridge() {
  try {
    return require("../../../files/backend/tool/index.js");
  } catch {
    return null;
  }
}

function loadSkillBridge() {
  try {
    return require("../../../skill/backend/tool-bridge.js");
  } catch {
    return null;
  }
}

function loadKanbanBridge() {
  try {
    return require("../../../kanban/backend/tool/tool-bridge.js");
  } catch {
    return null;
  }
}

function loadTodoBridge() {
  try {
    return require("../../../dedupe_level/level_03_todo/tool/index.js");
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
  const agentBridge = loadAgentBridge();
  if (agentBridge) specs.push(agentBridge.getToolSpec());
  const filesBridge = loadFilesBridge();
  if (filesBridge) specs.push(filesBridge.getToolSpec());
  const skillBridge = loadSkillBridge();
  if (skillBridge) specs.push(skillBridge.getToolSpec());
  const kanbanBridge = loadKanbanBridge();
  if (kanbanBridge) specs.push(kanbanBridge.getToolSpec());
  const todoBridge = loadTodoBridge();
  if (todoBridge) specs.push(todoBridge.getToolSpec());
  return specs;
}

async function executeAiTool(name, args, { agentId, notify, sessionId } = {}) {
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
  if (name === "agent") {
    const bridge = loadAgentBridge();
    if (!bridge) throw new Error("Agent module không khả dụng");
    const result = await bridge.execute(args.action, args);
    if (notify && ["create", "update", "delete"].includes(args.action)) {
      notify({ type: "agent", action: args.action, ...result });
    }
    return result;
  }
  if (name === "skill") {
    const bridge = loadSkillBridge();
    if (!bridge) throw new Error("Skill module không khả dụng");
    const result = await bridge.execute(args.action, args, agentId);
    if (notify && ["create", "update", "delete"].includes(args.action)) {
      notify({ type: "skill", action: args.action, ...result });
    }
    return result;
  }
  if (name === "kanban") {
    const bridge = loadKanbanBridge();
    if (!bridge) throw new Error("Kanban module không khả dụng");
    return bridge.execute(args.action, args, agentId);
  }
  if (name === "files") {
    const bridge = loadFilesBridge();
    if (!bridge) throw new Error("Files module không khả dụng");
    return bridge.execute(args.action, args);
  }
  if (name === "todo") {
    const bridge = loadTodoBridge();
    if (!bridge) throw new Error("Todo module không khả dụng");
    return bridge.execute(args.action, args, sessionId);
  }

  throw new Error(`Tool "${name}" không tồn tại`);
}

module.exports = { getToolSpecs, executeAiTool };
