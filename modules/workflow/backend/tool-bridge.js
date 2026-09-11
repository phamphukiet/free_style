// tool-bridge.js
// AI tool "workflow": CRUD catalog + điều khiển chạy (run/next) — mỗi lần
// chỉ trả 1 step hiện tại, tránh nạp lại toàn bộ plan vào context.

const workflowStore = require("./catalog/workflow-store");
const runStore = require("./catalog/engine/run-store");
const { runNextStep, getSteps } = require("./catalog/engine/run-step");

function getToolSpec() {
  return {
    name: "workflow",
    description:
      "Xem, tạo, sửa, xoá workflow (chuỗi bước cross-module) và điều khiển chạy " +
      "(action=run để bắt đầu, action=next để lấy/thực thi bước kế tiếp).",
    parameters: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["list", "create", "update", "delete", "run", "next"],
        },
        id: {
          type: "string",
          description: "id workflow, cần cho update/delete/run.",
        },
        runId: {
          type: "string",
          description: "id lần chạy, cần cho action=next.",
        },
        name: { type: "string" },
        description: { type: "string" },
        steps: {
          type: "array",
          description:
            "Danh sách step: [{id, tool, action, argsTemplate, label}]. tool là 1 trong " +
            "rule/skill/agent/files — trùng tên tool bridge đã đăng ký.",
        },
      },
      required: ["action"],
    },
  };
}

async function execute(action, args = {}, agentId) {
  switch (action) {
    case "list":
      return { workflows: workflowStore.list() };
    case "create":
      return workflowStore.upsert({
        name: args.name,
        description: args.description,
        steps: args.steps,
      });
    case "update":
      if (!args.id) throw new Error("Thiếu id để sửa workflow.");
      return workflowStore.upsert(args);
    case "delete":
      if (!args.id) throw new Error("Thiếu id để xoá workflow.");
      workflowStore.remove(args.id);
      return { deleted: args.id };
    case "run": {
      if (!args.id) throw new Error("Thiếu id workflow để chạy.");
      const steps = getSteps(args.id);
      const run = runStore.create(args.id, args.sessionId);
      return {
        runId: run.runId,
        totalSteps: steps.length,
        message: "Gọi action=next để bắt đầu.",
      };
    }
    case "next":
      if (!args.runId) throw new Error("Thiếu runId.");
      return runNextStep(args.runId, agentId);
    default:
      throw new Error(`Action "${action}" không tồn tại.`);
  }
}

module.exports = { getToolSpec, execute };
