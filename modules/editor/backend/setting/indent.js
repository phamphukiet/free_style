const { TARGET } = require("./target");

module.exports = [
  {
    id: "editor.tabSize",
    group: "Editor",
    label: "Tab Size",
    type: "number",
    default: 2,
    min: 1,
    max: 8,
    order: 20,
    effects: [{ target: TARGET, payload: { tabSize: "$value" } }],
  },
  {
    id: "editor.insertSpaces",
    group: "Editor",
    label: "Insert Spaces",
    type: "boolean",
    default: true,
    order: 21,
    effects: [{ target: TARGET, payload: { insertSpaces: "$value" } }],
  },
];
