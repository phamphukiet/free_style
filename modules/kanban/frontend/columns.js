// kanban-columns.js
// Bản sao thông tin cột cho frontend (không thể require file backend Node
// qua contextIsolation). Đồng bộ tay với modules/workflow/backend/kanban/columns.js.

export const COLUMNS = [
  { id: "ALL", label: "ALL", limit: Infinity },
  { id: "doing", label: "Đang làm", limit: 3 },
  { id: "agent_working", label: "Agent đang chạy", limit: 3 },
  { id: "result", label: "Kết quả (chờ duyệt)", limit: 3 },
  { id: "done", label: "Hoàn tất", limit: 3 },
];
