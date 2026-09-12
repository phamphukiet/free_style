// propose-result.js
// Agent gọi khi có bản đề xuất — chuyển task sang cột "result" (cột 4), tăng version.
// KHÔNG set "done" — chỉ approve-task.js mới có quyền đó.

const { getTask, saveTask } = require("./board-store");
const { moveTask } = require("./move-task");

function proposeResult(taskId, summary) {
  const task = getTask(taskId);
  if (!task) throw new Error("Task không tồn tại.");

  const moved = moveTask({ taskId, toColumnId: "result", actor: "agent" });
  if (moved.blocked) return moved;

  moved.result = {
    version: (task.result?.version || 0) + 1,
    summary: summary || "",
    proposedAt: Date.now(),
  };
  return saveTask(moved);
}

module.exports = { proposeResult };
