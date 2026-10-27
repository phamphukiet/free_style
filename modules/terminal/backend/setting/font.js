const { TARGET } = require("./target");

module.exports = [
  {
    id: "terminal.fontSize",
    group: "Terminal",
    label: "Font Size",
    type: "number",
    default: 13,
    min: 6,
    max: 72,
    order: 10,
    effects: [{ target: TARGET, payload: { fontSize: "$value" } }],
  },
  {
    id: "terminal.fontFamily",
    group: "Terminal",
    label: "Font Family",
    type: "string",
    default: "'Cascadia Code', 'Consolas', 'Courier New', monospace",
    order: 11,
    effects: [{ target: TARGET, payload: { fontFamily: "$value" } }],
  },
  {
    id: "terminal.tabSize",
    group: "Terminal",
    label: "Tab Size",
    type: "number",
    default: 4,
    min: 1,
    max: 8,
    order: 12,
    effects: [{ target: TARGET, payload: { tabStopWidth: "$value" } }],
  },
];