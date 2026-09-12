// move-task.js
// Điểm DUY NHẤT enforce WIP limit + state machine hợp lệ.
// Dùng chung cho UI kéo-thả và AI tool-bridge — tránh viết trùng logic 2 nơi.

const { listTasks, getTask, saveTask } = require("./board-store");
const { getColumn, isValidColumn } = require("./columns");

// "done" chỉ được set qua approve-task.js — move-task luôn từ chối đích này,
// vì chỉ user thật mới được xác nhận task xong (kể cả khi agent gọi tool).
function moveTask({ taskId, toColumnId, actor = "user" }) {
  if (!isValidColumn(toColumnId) || toColumnId === "done") {
    throw new Error(`Cột đích "${toColumnId}" không hợp lệ cho move-task.`);
  }
  const task = getTask(taskId);
  if (!task) throw new Error("Task không tồn tại.");
  if (task.columnId === toColumnId) return task;

  const column = getColumn(toColumnId);
  const countInColumn = listTasks().filter(
    (t) => t.columnId === toColumnId && t.id !== taskId,
  ).length;
  if (countInColumn >= column.limit) {
    return {
      blocked: true,
      message: `Cột "${column.label}" đã đầy (${column.limit}/${column.limit}), hãy xử lý/duyệt bớt task trước.`,
    };
  }

  const from = task.columnId;
  task.columnId = toColumnId;
  task.order = Date.now();
  task.history = [
    ...task.history,
    { at: Date.now(), from, to: toColumnId, actor },
  ];
  return saveTask(task);
}

module.exports = { moveTask };
