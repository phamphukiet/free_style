// bus.js
// Cài đặt port bus: chỉ chạy lệnh module đã công bố, kiểm tra args.
// runIn "main": gọi def.run(args). runIn "renderer" (mặc định): phát event cho renderer.

const COMMAND_CHANNEL = "extension:command";
const { argsError } = require("./args.js");

// Dạng lệnh mà chat (matcher, handle-command) đọc: module, name, label, aliases, runIn, danger, args.
function describe({ moduleId, name, def }) {
  return {
    module: moduleId,
    name,
    label: def.label,
    aliases: def.aliases ?? [],
    runIn: def.runIn ?? "renderer",
    danger: Boolean(def.danger),
    args: def.args,
    guide: def.guide,
  };
}

function lookup({ table, moduleId, name }) {
  if (!Object.hasOwn(table, moduleId)) return null;
  const defs = table[moduleId];
  return Object.hasOwn(defs, name) ? defs[name] : null;
}

/** @param {{ scan: () => object, send: (arg: { channel: string, payload: object }) => void }} deps */
function createCommandBus({ scan, send }) {
  let table = null;
  const getTable = () => (table ??= scan());

  return {
    list: () =>
      Object.entries(getTable()).flatMap(([moduleId, defs]) =>
        Object.entries(defs).map(
          ([name, def]) => describe({ moduleId, name, def }), // ← phải gọi describe
        ),
      ),

    async run({ module: moduleId, name, args = {} }) {
      const def = lookup({ table: getTable(), moduleId, name });
      if (!def) throw new Error(`Lệnh "${moduleId}.${name}" không tồn tại`);
      const bad = argsError({ schema: def.args, args });
      if (bad) throw new Error(`Lệnh "${moduleId}.${name}": ${bad}`);
      if (def.runIn === "main" && typeof def.run === "function")
        return def.run(args);
      send({
        channel: COMMAND_CHANNEL,
        payload: { module: moduleId, name, args },
      });
      return true;
    },
  };
}

module.exports = { COMMAND_CHANNEL, createCommandBus };
