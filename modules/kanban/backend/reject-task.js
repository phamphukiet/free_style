// reject-task.js
// Reject: về "agent_working" nếu task có agent (fallback "doing" nếu không),
// tự động post lý do vào chat + trigger agent trả lời ngay (không đợi user gõ tiếp).

const { getTask, saveTask } = require("./board-store");
const { appendMessage } = require("./chat-store");
const { replyAsAgent } = require("./agent-reply");

async function rejectTask(taskId, reason) {
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
    { at: Date.now(), from, to: toColumnId, actor: "user", reason },
  ];
  saveTask(task);

  appendMessage(taskId, {
    role: "user",
    content: `Kết quả bị từ chối. Lý do: ${reason || "(không nêu rõ)"}`,
  });

  let agentReplied = false;
  if (task.agentId) {
    try {
      await replyAsAgent(task);
      agentReplied = true;
    } catch (error) {
      appendMessage(taskId, {
        role: "assistant",
        content: `Lỗi khi agent phản hồi tự động: ${error.message}`,
      });
    }
  }

  return { task, agentReplied };
}

module.exports = { rejectTask };
