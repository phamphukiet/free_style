// build.js — bảng → danh sách lệnh cùng dạng bus.list(), kèm `run` để chạy thẳng.

const table = require("./table");
const { settingsTool, optionKind } = require("./ref");

const MODULE = "settings"; // phải trùng id mode của module settings

const setValue = ({ id, value }) =>
  settingsTool().execute({ action: "set", id, value });

const base = { module: MODULE, runIn: "main", danger: false };

function selectCommand({ id, names: [label, ...aliases] }) {
  return {
    ...base,
    name: `quick:${id}`,
    label,
    aliases,
    args: { value: { type: "string", entity: optionKind(id) } },
    run: ({ value }) => {
      setValue({ id, value });
      return { items: [{ key: value, ok: true }] };
    },
  };
}

function toggleCommands({ id, names }) {
  return [
    ["bật", true],
    ["tắt", false],
  ].map(([verb, value]) => ({
    ...base,
    name: `quick:${id}:${value ? "on" : "off"}`,
    label: `${verb} ${names[0]}`,
    aliases: names.slice(1).map((n) => `${verb} ${n}`),
    args: {},
    run: () => {
      setValue({ id, value });
    },
  }));
}

const KINDS = { select: (row) => [selectCommand(row)], toggle: toggleCommands };

function listQuickCommands() {
  if (!settingsTool()) return []; // module settings bị đóng băng
  return table.flatMap((row) => KINDS[row.kind]?.(row) ?? []);
}

module.exports = { listQuickCommands };
