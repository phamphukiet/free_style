// run-task.js
// Trách nhiệm duy nhất: "Chạy" 1 task — tự động tiến 1 bước trong tiến trình
// (doing -> agent_working -> result), phát cờ running real-time qua saveTask
// (board-store tự broadcast "kanban:changed" mỗi lần ghi).

const { getTask, saveTask } = require("../board/board-store");
const { moveTask } = require("../board/move-task");
const { proposeResult } = require("../board/propose-result");
const { runAgentOnSession } = require("./task-session");

function buildRunMessage(task, session) {
  if (!session.messages || session.messages.length === 0) {
    return (
      `Yêu cầu task Kanban "${task.title}": ${task.description || "(không có mô tả)"}.\n` +
      `Hãy trực tiếp lập trình/chỉnh sửa file cần thiết trong project qua tool "files" ` +
      `để hoàn thành yêu cầu này, không chỉ mô tả suông.`
    );
  }
  return `Tiếp tục thực hiện task "${task.title}", xử lý các phần còn thiếu dựa trên lịch sử trên.`;
}

function summarize(text) {
  const s = (text || "").trim();
  return s.length > 200 ? s.slice(0, 200) + "..." : s || "Agent đã xử lý xong.";
}

async function runTask(taskId, notify) {
  console.log("[run-task] bắt đầu", taskId, Date.now());
  const task = getTask(taskId);
  if (!task) throw new Error("Task không tồn tại.");
  if (!task.agentId) throw new Error("Task chưa gán agent.");
  if (task.running) throw new Error("Task đang chạy, vui lòng đợi.");
  if (task.columnId !== "agent_working") {
    const moved = moveTask({
      taskId,
      toColumnId: "agent_working",
      actor: "agent",
    });
    if (moved.blocked) throw new Error(moved.message);
  }
  const sessionStore = require("../../../chat/backend/session-store");
  const { ensureSession } = require("./task-session");
  const session = ensureSession(taskId);
  const message = buildRunMessage(getTask(taskId), session);

  saveTask({ ...getTask(taskId), running: true });
  let result;
  try {
    result = await runAgentOnSession(taskId, message, notify);
  } finally {
    saveTask({ ...getTask(taskId), running: false });
  }

  const after = getTask(taskId);
  if (after.columnId === "agent_working") {
    return proposeResult(taskId, summarize(result?.content));
  }
  return after; // agent tự move/propose qua tool "kanban" rồi
}

module.exports = { runTask };
