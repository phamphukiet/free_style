const { TARGET } = require("./target");
const toggle = [
  { value: "on", label: "On" },
  { value: "off", label: "Off" },
];
const BLINKING = ["blink", "smooth", "phase", "expand", "solid"].map((v) => ({
  value: v,
  label: v,
}));

module.exports = [
  {
    id: "editor.wordWrap",
    group: "Editor",
    label: "Word Wrap",
    type: "select",
    default: "on",
    options: toggle,
    order: 30,
    effects: [{ target: TARGET, payload: { wordWrap: "$value" } }],
  },
  {
    id: "editor.minimap",
    group: "Editor",
    label: "Minimap",
    type: "boolean",
    default: true,
    order: 31,
    effects: [{ target: TARGET, payload: { minimap: { enabled: "$value" } } }],
  },
  {
    id: "editor.cursorBlinking",
    group: "Editor",
    label: "Cursor Blinking",
    type: "select",
    default: "blink",
    options: BLINKING,
    order: 32,
    effects: [{ target: TARGET, payload: { cursorBlinking: "$value" } }],
  },
];
