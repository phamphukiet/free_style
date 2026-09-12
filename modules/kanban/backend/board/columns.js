// columns.js
// Định nghĩa 5 cột cố định + giới hạn WIP — nguồn chân lý DUY NHẤT,
// move-task/tool-bridge/ipc đều import từ đây, không hardcode lại.

const COLUMNS = [
  { id: "ALL", label: "ALL", limit: Infinity },
  { id: "doing", label: "DOING", limit: 3 },
  { id: "agent_working", label: "ON WORK", limit: 3 },
  { id: "result", label: "RESULT", limit: 3 },
  { id: "done", label: "DONE", limit: 3 },
];

const COLUMN_IDS = COLUMNS.map((c) => c.id);

function getColumn(id) {
  return COLUMNS.find((c) => c.id === id) || null;
}

function isValidColumn(id) {
  return COLUMN_IDS.includes(id);
}

module.exports = { COLUMNS, COLUMN_IDS, getColumn, isValidColumn };
