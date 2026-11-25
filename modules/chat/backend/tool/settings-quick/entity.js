// entity.js — bộ tìm "giá trị hợp lệ của 1 setting select" (capability kind "entity").
// Lấy option qua describe nên mẫu do user/AI thêm cũng tìm được.

const {
  registerCapability,
} = require("../../../../../shared/core/capability-registry.js");
const { rank } = require("../../../../../shared/command/rank.js");
const table = require("./table");
const { settingsTool, optionKind } = require("./ref");

const toItem = (o) => ({
  key: o.value,
  label: o.label,
  names: [o.label, String(o.value)],
});

function finderOf({ id }) {
  return {
    find: async ({ text }) => {
      const { options = [] } = settingsTool().execute({
        action: "describe",
        id,
      });
      return rank({ items: options.map(toItem), text });
    },
  };
}

function registerOptionFinders() {
  table
    .filter((row) => row.kind === "select")
    .forEach(({ id }) =>
      registerCapability({
        kind: "entity",
        id: optionKind(id),
        ...finderOf({ id }),
      }),
    );
}

module.exports = { registerOptionFinders };
