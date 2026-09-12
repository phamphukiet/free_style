// reject-task.js
// Reject: về "agent_working" nếu task có agent (fallback "doing" nếu không),
// tự động post lý do vào chat + trigger agent trả lời ngay (không đợi user gõ tiếp).

const { getTask, saveTask } = require("./board-store");
const { runAgentOnSession, appendComment } = require("../chat/task-session");
const { appendMessage } = require("../chat/chat-store");
const { replyAsAgent } = require("../chat/agent-reply");

async function rejectTask(taskId, reason) {
  const task = getTask(taskId);
  if (!task) throw new Error("Task không tồn tại.");
  if (task.columnId !== "result") {
    throw new Error("Chỉ reject được task đang ở cột Kết quả.");
  }

  const toColumnId = "doing";
  const from = task.columnId;
  task.columnId = toColumnId;
  task.history = [
    ...task.history,
    { at: Date.now(), from, to: toColumnId, actor: "user", reason },
  ];
  saveTask(task);

  appendComment(
    taskId,
    `Kết quả bị từ chối. Lý do: ${reason || "(không nêu rõ)"}`,
  );

  let agentReplied = false;
  if (task.agentId) {
    try {
      await runAgentOnSession(
        taskId,
        `Kết quả trước đó bị từ chối. Lý do: ${reason || "(không nêu rõ)"}. Hãy sửa lại theo góp ý.`,
      );
      agentReplied = true;
    } catch (error) {
      appendComment(taskId, `Lỗi khi agent phản hồi tự động: ${error.message}`);
    }
  }

  return { task, agentReplied };
}

module.exports = { rejectTask };
