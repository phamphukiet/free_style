// ext.js
// Lệnh extension cho chat. Nhận nhiều đối tượng, lỗi 1 mục không làm hỏng cả lô.

const {
  getService,
} = require("../../../../../shared/core/capability-registry.js");
const { eachTarget } = require("../../../../../shared/command/each.js");
const TARGETS = {
  targets: { type: "string", many: true, entity: "extension" },
};

function service() {
  const api = getService({
    id: "extension",
    needs: ["list", "remove", "setEnabled"],
  });
  if (!api) throw new Error("Module extension chưa sẵn sàng");
  return api;
}

const toggle =
  (enabled) =>
  ({ targets }) =>
    eachTarget({
      targets,
      task: (id) => service().setEnabled({ id, enabled }),
    });

module.exports = {
  remove: {
    label: "Remove extension",
    aliases: ["remove"],
    runIn: "main",
    danger: true,
    args: TARGETS,
    run: ({ targets }) =>
      eachTarget({ targets, task: (id) => service().remove({ id }) }),
  },
  enable: {
    label: "Enable extension",
    aliases: ["enable"],
    runIn: "main",
    args: TARGETS,
    run: toggle(true),
  },
  disable: {
    label: "Disable extension",
    aliases: ["disable"],
    runIn: "main",
    args: TARGETS,
    run: toggle(false),
  },
  list: {
    label: "List extensions",
    aliases: ["list"],
    runIn: "main",
    run: () => ({
      items: service()
        .list()
        .map((e) => ({
          key: e.id,
          label: `${e.name} (${e.status})`,
          ok: true,
        })),
    }),
  },
};
