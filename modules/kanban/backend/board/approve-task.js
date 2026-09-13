// approve-task.js
// Trách nhiệm duy nhất: duyệt task "result" -> "done".
// Chỉ user thật gọi qua IPC (kanban:approve-task) — agent không có quyền
// set "done" (xem rule ở move-task.js). clearDoneTasks dùng cho AI tool
// "clear-done" (đã confirm 2 bước ở tool-bridge.js).

const { getTask, saveTask, listTasks, removeTask } = require("./board-store");

function approveTask(taskId) {
  const task = getTask(taskId);
  if (!task) throw new Error("Task không tồn tại.");
  if (task.columnId !== "result") {
    throw new Error("Chỉ duyệt được task đang ở cột Kết quả.");
  }

  const from = task.columnId;
  task.columnId = "done";
  task.running = false;
  task.history = [
    ...task.history,
    { at: Date.now(), from, to: "done", actor: "user" },
  ];
  return saveTask(task);
}

function clearDoneTasks() {
  const done = listTasks().filter((t) => t.columnId === "done");
  done.forEach((t) => removeTask(t.id));
  return { cleared: done.length };
}

module.exports = { approveTask, clearDoneTasks };