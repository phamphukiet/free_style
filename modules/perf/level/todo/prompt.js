// prompt.js — render todo hiện tại thành text ngắn, nhúng vào systemPrompt mỗi bước.
const { getList } = require("./store");

const ICON = { pending: "[ ]", in_progress: "[~]", done: "[x]" };

function renderTodoPrompt(sessionId) {
  const items = getList(sessionId);
  if (!items.length) return "";
  const lines = items.map((it) => `${ICON[it.status] || "[ ]"} ${it.content}`);
  return `## Todo hiện tại (đừng lặp lại việc đã [x]):\n${lines.join("\n")}`;
}

module.exports = { renderTodoPrompt };
