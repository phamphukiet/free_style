// update-task.js
// Cập nhật trực tiếp title/description/agentId — không đổi cột, không ghi history.
// Dùng chung cho popup sửa task (IPC) và AI tool "kanban" action=update.

const { getTask, saveTask } = require("./board-store");

function updateTask(taskId, patch = {}) {
  const task = getTask(taskId);
  if (!task) throw new Error("Task không tồn tại.");
  return saveTask({
    ...task,
    title: patch.title ?? task.title,
    description: patch.description ?? task.description,
    agentId: patch.agentId ?? task.agentId,
  });
}

module.exports = { updateTask };
