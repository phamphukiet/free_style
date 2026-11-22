// ext.js
// Lệnh extension cho chat. Nhận nhiều đối tượng, lỗi 1 mục không làm hỏng cả lô.

const {
  getService,
} = require("../../../../../shared/core/capability-registry.js");

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

async function eachTarget({ targets, task }) {
  const items = [];
  for (const key of targets) {
    items.push(
      await task(key).then(
        () => ({ key, ok: true }),
        (error) => ({ key, ok: false, error: error.message }),
      ),
    );
  }
  return { items };
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
    label: "Gỡ extension",
    aliases: ["xoá"],
    runIn: "main",
    danger: true,
    args: TARGETS,
    run: ({ targets }) =>
      eachTarget({ targets, task: (id) => service().remove({ id }) }),
  },
  enable: {
    label: "Bật extension",
    aliases: ["bật"],
    runIn: "main",
    args: TARGETS,
    run: toggle(true),
  },
  disable: {
    label: "Tắt extension",
    aliases: ["tắt"],
    runIn: "main",
    args: TARGETS,
    run: toggle(false),
  },
  list: {
    label: "Liệt kê extension",
    aliases: ["danh sách ext"],
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
