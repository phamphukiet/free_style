// reject-task.js
// Reject: về "agent_working" nếu task có agent (fallback "doing" nếu không).
// KHÔNG tự gọi agent — chỉ post comment ra lệnh hỏi lại, để user tự trao đổi
// nhiều vòng trong Chat panel (tránh giới hạn 4-bước tool-call mỗi lượt gửi).

const { getTask, saveTask } = require("./board-store");
const { appendComment } = require("../chat/task-session");

async function rejectTask(taskId) {
  const task = getTask(taskId);
  if (!task) throw new Error("Task không tồn tại.");
  if (task.columnId !== "result") {
    throw new Error("Chỉ reject được task đang ở cột Kết quả.");
  }

  const toColumnId = task.agentId ? "agent_working" : "doing";
  const from = task.columnId;
  task.columnId = toColumnId;
  task.history = [
    ...task.history,
    { at: Date.now(), from, to: toColumnId, actor: "user" },
  ];
  saveTask(task);

  appendComment(
    taskId,
    "Kết quả trước đó bị từ chối. Hãy hỏi lại người dùng vấn đề cụ thể cần sửa trước khi tiếp tục.",
  );

  return { task };
}

module.exports = { rejectTask };