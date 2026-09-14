// actions.js
const { getList, saveList } = require("../store");

function list(sessionId) {
  return { items: getList(sessionId) };
}

function write(sessionId, items) {
  if (!Array.isArray(items) || items.length === 0)
    throw new Error("Thiếu items hoặc items rỗng.");
  const inProgress = items.filter((it) => it.status === "in_progress");
  if (inProgress.length > 1)
    throw new Error(
      "Chỉ được có tối đa 1 item 'in_progress' tại một thời điểm.",
    );

  const normalized = items.map((it, i) => ({
    id: i + 1,
    content: it.content,
    status: it.status || "pending",
  }));
  saveList(sessionId, normalized);
  return {
    message: `Đã cập nhật ${normalized.length} todo.`,
    items: normalized,
  };
}

module.exports = { list, write };
