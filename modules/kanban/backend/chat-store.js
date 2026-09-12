// chat-store.js
// Chat riêng từng task tại <project>/.vibe/kanban/chat/<taskId>.json.
// Tách khỏi modules/chat/backend/session-store.js (global) vì chat của task
// phải đi theo project (copy project sang máy khác vẫn còn lịch sử).

const path = require("path");
const fs = require("fs");
const { getProjectPath } = require("./board-store");

function chatFile(projectPath, taskId) {
  return path.join(projectPath, ".vibe", "kanban", "chat", `${taskId}.json`);
}

function getMessages(taskId) {
  const projectPath = getProjectPath();
  if (!projectPath) return [];
  try {
    return JSON.parse(fs.readFileSync(chatFile(projectPath, taskId), "utf-8"));
  } catch {
    return [];
  }
}

function appendMessage(taskId, message) {
  const projectPath = getProjectPath();
  if (!projectPath) throw new Error("Chưa mở project nào.");
  const messages = [...getMessages(taskId), { ...message, at: Date.now() }];
  const file = chatFile(projectPath, taskId);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(messages, null, 2), "utf-8");
  return messages;
}

module.exports = { getMessages, appendMessage };