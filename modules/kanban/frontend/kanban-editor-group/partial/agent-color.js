// agent-color.js
// Hash id agent -> màu cố định trong palette, dùng cho card + dropdown lọc.

const PALETTE = [
  "#e57373",
  "#64b5f6",
  "#81c784",
  "#ffb74d",
  "#ba68c8",
  "#4dd0e1",
  "#f06292",
  "#a1887f",
];

export function agentColor(agentId) {
  if (!agentId) return "#888888";
  let hash = 0;
  for (let i = 0; i < agentId.length; i++) {
    hash = (hash * 31 + agentId.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}
