const { TARGET } = require("./target");

module.exports = [
  {
    id: "terminal.cursorBlink",
    group: "Terminal",
    label: "Cursor Blink",
    type: "boolean",
    default: true,
    order: 21,
    effects: [{ target: TARGET, payload: { cursorBlink: "$value" } }],
  },
  {
    id: "terminal.scrollback",
    group: "Terminal",
    label: "Scrollback",
    type: "number",
    default: 5000,
    min: 500,
    max: 100000,
    order: 22,
    effects: [{ target: TARGET, payload: { scrollback: "$value" } }],
  },
];