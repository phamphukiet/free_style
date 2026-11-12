// limits.js
// Giới hạn chạy ext. Memory/timeout có hiệu lực từ lần ext chạy lại kế tiếp.
module.exports = [
  {
    id: "extension.maxCrashes",
    group: "Extension",
    label: "Số lần lỗi tối đa trước khi tự tắt",
    type: "number",
    default: 3,
    min: 1,
    max: 10,
    order: 10,
    scope: "global",
  },
  {
    id: "extension.memoryMb",
    group: "Extension",
    label: "Bộ nhớ tối đa mỗi ext (MB)",
    type: "number",
    default: 64,
    min: 16,
    max: 512,
    order: 11,
    scope: "global",
  },
  {
    id: "extension.loadTimeoutMs",
    group: "Extension",
    label: "Thời gian chờ nạp ext (ms)",
    type: "number",
    default: 3000,
    min: 500,
    max: 30000,
    order: 12,
    scope: "global",
  },
];
