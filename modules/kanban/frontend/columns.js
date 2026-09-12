// kanban-columns.js
// Bản sao thông tin cột cho frontend (không thể require file backend Node
// qua contextIsolation). Đồng bộ tay với modules/workflow/backend/kanban/columns.js.

export const COLUMNS = [
  { id: "ALL", label: "ALL", limit: Infinity },
  { id: "doing", label: "DOING", limit: 3 },
  { id: "agent_working", label: "ON WORK", limit: 3 },
  { id: "result", label: "RESULT", limit: 3 },
  { id: "done", label: "DONE", limit: 3 },
];
