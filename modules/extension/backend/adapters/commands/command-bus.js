// command-bus.js
// Cài đặt port command-bus: chỉ chạy lệnh module đã công bố, kiểm tra args.
// runIn "main": gọi def.run(args). runIn "renderer" (mặc định): phát event cho renderer.

const COMMAND_CHANNEL = "extension:command";

function lookup({ table, moduleId, name }) {
  if (!Object.hasOwn(table, moduleId)) return null;
  const defs = table[moduleId];
  return Object.hasOwn(defs, name) ? defs[name] : null;
}

// schema: { tênArg: "string" | "number" | "boolean" }. Không khai báo = lệnh không nhận args.
function argsError({ schema = {}, args }) {
  if (args === null || typeof args !== "object") return "args phải là object";
  const extra = Object.keys(args).find((key) => !Object.hasOwn(schema, key));
  if (extra) return `không có tham số "${extra}"`;
  const bad = Object.entries(schema).find(
    ([key, type]) => typeof args[key] !== type,
  );
  return bad ? `tham số "${bad[0]}" phải là ${bad[1]}` : null;
}

/** @param {{ scan: () => object, send: (arg: { channel: string, payload: object }) => void }} deps */
function createCommandBus({ scan, send }) {
  let table = null;
  const getTable = () => (table ??= scan());

  return {
    list: () =>
      Object.entries(getTable()).flatMap(([moduleId, defs]) =>
        Object.entries(defs).map(([name, def]) => ({
          module: moduleId,
          name,
          label: def.label ?? name,
          args: def.args ?? {},
          runIn: def.runIn ?? "renderer",
        })),
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
