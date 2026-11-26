// Lệnh setting cho chat: bật / tắt / đổi. Đi qua tool "settings" nên vẫn validate,
// kiểm tra quyền aiAccess, lưu và phát effect như user đổi tay. Setting mới là dùng được ngay.

const {
  getCapability,
} = require("../../../../../shared/core/capability-registry.js");
const { rank } = require("../../../../../shared/command/rank.js");
const { eachTarget } = require("../../../../../shared/command/each.js");

const TARGETS = { type: "string", many: true, entity: "setting" };

function settings() {
  const tool = getCapability({ kind: "tool", id: "settings" });
  if (!tool) throw new Error("Module settings chưa sẵn sàng");
  return tool;
}

function pickOption({ info, raw }) {
  const items = info.options.map((o) => ({
    key: o.value,
    label: o.label,
    names: [o.label, String(o.value)],
  }));
  const [hit] = rank({ items, text: raw });
  if (hit) return hit.key;
  const valid = info.options.map((o) => o.value).join(", ");
  throw new Error(`"${raw}" không nằm trong: ${valid}`);
}

const CONVERT = {
  number: ({ raw }) => Number(raw),
  string: ({ raw }) => raw,
  select: pickOption,
  boolean: () => {
    throw new Error("công tắc dùng lệnh bật / tắt");
  },
};

function setBoolean({ id, value }) {
  const { type } = settings().execute({ action: "describe", id });
  if (type !== "boolean") throw new Error("không phải công tắc bật / tắt");
  settings().execute({ action: "set", id, value });
}

function setValue({ id, raw }) {
  const info = settings().execute({ action: "describe", id });
  const value = CONVERT[info.type]({ info, raw });
  settings().execute({ action: "set", id, value });
}

const toggle =
  (value) =>
  ({ targets }) =>
    eachTarget({ targets, task: (id) => setBoolean({ id, value }) });

module.exports = {
  enable: {
    label: "Enable setting",
    aliases: ["enable"],
    runIn: "main",
    args: { targets: TARGETS },
    run: toggle(true),
  },
  disable: {
    label: "Disable setting",
    aliases: ["disable"],
    runIn: "main",
    args: { targets: TARGETS },
    run: toggle(false),
  },
  change: {
    label: "Change setting",
    aliases: ["change", "update", "set"],
    runIn: "main",
    args: { target: { type: "string", entity: "setting" }, value: "string" },
    run: ({ target, value }) =>
    eachTarget({
        targets: [target],
        task: (id) => setValue({ id, raw: value }),
    }),
  },
};
