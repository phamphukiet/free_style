// tool-bridge.js
// AI tool "kanban": agent thao tác board qua đây. KHÔNG có action approve —
// chuyển "done" chỉ được thực hiện bởi user thật qua IPC (xem ipc.js).

const { listTasks, createTask } = require("../board/board-store");
const { updateTask } = require("../board/update-task");
const { moveTask } = require("../board/move-task");
const { proposeResult } = require("../board/propose-result");
const { clearDoneTasks } = require("../board/approve-task");
const { appendComment } = require("../chat/task-session");
const { getToolSpec } = require("./tool-spec");

function execute(action, args = {}) {
  switch (action) {
    case "list":
      return { tasks: listTasks() };
    case "create":
      if (!args.title) throw new Error("Thiếu title.");
      return createTask(args);
    case "update":
      if (!args.taskId) throw new Error("Thiếu taskId.");
      return updateTask(args.taskId, {
        title: args.title,
        description: args.description,
        agentId: args.agentId,
      });
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
      appendComment(args.taskId, args.message);
      return { ok: true };
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
