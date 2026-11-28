// ext.js
// Lệnh extension cho chat. Nhận nhiều đối tượng, lỗi 1 mục không làm hỏng cả lô.

const {
  getService,
} = require("../../../../../shared/core/capability-registry.js");
const { eachTarget } = require("../../../../../shared/command/each.js");
const TARGETS = {
  targets: { type: "string", many: true, entity: "extension" },
};
const { CONTRACT } = require("../../domain/contract");
const confirm = (options) =>
  getService({ id: "confirm", needs: ["ask"] })?.ask(options) ?? false;

function service() {
  const api = getService({
    id: "extension",
    needs: ["list", "remove", "setEnabled", "create", "save"],
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

async function build({ name, code }) {
  const api = service();
  const ok = await confirm({
    message: `Tạo và bật tiện ích "${name}"?`,
    detail: "Tiện ích sẽ chạy ngay sau khi tạo.",
  });
  if (!ok) return { items: [{ key: name, ok: false, error: "đã huỷ" }] };
  const { id } = await api.create({ name });
  try {
    await api.save({ id, code });
    await api.setEnabled({ id, enabled: true });
  } catch (error) {
    await api.remove({ id }).catch(() => {});
    throw error;
  }
  return { items: [{ key: id, label: name, ok: true }] };
}

module.exports = {
  create: {
    label: "Create and enable an extension",
    aliases: ["create"],
    runIn: "main",
    guide: CONTRACT,
    args: {
      name: "string",
      code: {
        type: "string",
        generated:
          "full JavaScript source of the extension (module.exports = {...})",
      },
    },
    run: build,
  },
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
