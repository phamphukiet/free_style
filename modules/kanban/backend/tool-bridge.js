// tool-bridge.js
// AI tool "kanban": agent thao tác board qua đây. KHÔNG có action approve —
// chuyển "done" chỉ được thực hiện bởi user thật qua IPC (xem ipc.js).

const { listTasks, createTask } = require("./board-store");
const { moveTask } = require("./move-task");
const { proposeResult } = require("./propose-result");
const { clearDoneTasks } = require("./approve-task");
const { appendMessage } = require("./chat-store");

function getToolSpec() {
  return {
    name: "kanban",
    description:
      "Quản lý task trên Kanban board của project: xem, tạo, chuyển cột, đề xuất kết quả, " +
      "bình luận, hoặc dọn task đã hoàn tất khi user yêu cầu rõ ràng.",
    parameters: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: [
            "list",
            "create",
            "move",
            "propose-result",
            "comment",
            "clear-done",
          ],
        },
        taskId: { type: "string" },
        title: { type: "string" },
        description: { type: "string" },
        toColumnId: {
          type: "string",
          enum: ["ALL", "doing", "agent_working", "result"],
          description:
            "Không bao gồm 'done' — action=move không được set done.",
        },
        summary: {
          type: "string",
          description: "Tóm tắt kết quả, cho action=propose-result.",
        },
        message: {
          type: "string",
          description: "Nội dung bình luận, cho action=comment.",
        },
        confirmed: {
          type: "boolean",
          description: "Bắt buộc true để thực sự dọn done (action=clear-done).",
        },
      },
      required: ["action"],
    },
  };
}

function execute(action, args = {}) {
  switch (action) {
    case "list":
      return { tasks: listTasks() };
    case "create":
      if (!args.title) throw new Error("Thiếu title.");
      return createTask(args);
    case "move":
      if (!args.taskId || !args.toColumnId)
        throw new Error("Thiếu taskId/toColumnId.");
      return moveTask({
        taskId: args.taskId,
        toColumnId: args.toColumnId,
        actor: "agent",
      });
    case "propose-result":
      if (!args.taskId) throw new Error("Thiếu taskId.");
      return proposeResult(args.taskId, args.summary);
    case "comment":
      if (!args.taskId || !args.message)
        throw new Error("Thiếu taskId/message.");
      return {
        messages: appendMessage(args.taskId, {
          role: "assistant",
          content: args.message,
        }),
      };
    case "clear-done":
      if (!args.confirmed) {
        return {
          needsConfirmation: true,
          message:
            "Xác nhận dọn toàn bộ task đã hoàn tất? Gọi lại với confirmed=true nếu đồng ý.",
        };
      }
      return clearDoneTasks();
    default:
      throw new Error(`Action "${action}" không tồn tại.`);
  }
}

module.exports = { getToolSpec, execute };
