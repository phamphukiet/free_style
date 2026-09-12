// task-session.js
// Cầu nối kanban <-> chat session TOÀN CỤC (session-store.js dùng chung với
// Chat panel bên phải). Mỗi task có đúng 1 session, đặt tên theo task,
// để user thấy agent "làm việc" ngay trong Chat panel, không cần popup riêng.

const sessionStore = require("../../../chat/backend/session-store");
const { handleSend } = require("../../../chat/backend/send/send-handler");
const { getTask, saveTask } = require("../board/board-store");

function ensureSession(taskId) {
  const task = getTask(taskId);
  if (!task) throw new Error("Task không tồn tại.");

  if (task.sessionId && sessionStore.get(task.sessionId)) {
    return sessionStore.get(task.sessionId);
  }

  const session = sessionStore.save({
    agentId: task.agentId,
    title: `Task: ${task.title}`,
    messages: [],
  });
  saveTask({ ...task, sessionId: session.id });
  return session;
}

function appendComment(taskId, content) {
  const session = ensureSession(taskId);
  sessionStore.appendMessage(session.id, { role: "assistant", content });
}

async function runAgentOnSession(taskId, message, notify) {
  const task = getTask(taskId);
  const session = ensureSession(taskId);
  return handleSend(
    { message, agentId: task.agentId, sessionId: session.id },
    notify,
  );
}

module.exports = { ensureSession, appendComment, runAgentOnSession };
