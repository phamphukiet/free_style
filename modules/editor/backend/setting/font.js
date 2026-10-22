const TARGET = "monaco.options";

module.exports = [
  {
    id: "editor.fontSize",
    group: "Editor",
    label: "Font Size",
    type: "number",
    default: 14,
    min: 6,
    max: 72,
    order: 10,
    effects: [{ target: TARGET, payload: { fontSize: "$value" } }],
  },
  {
    id: "editor.fontFamily",
    group: "Editor",
    label: "Font Family",
    type: "string",
    default: "Consolas, 'Courier New', monospace",
    order: 11,
    effects: [{ target: TARGET, payload: { fontFamily: "$value" } }],
  },
];
