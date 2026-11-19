const {
  defineCommands,
  requireTool,
  parseJson,
} = require("../../../../../shared/command/crud.js");

const ID = { id: "string" };
const byId =
  (action) =>
  (tool, { id }) =>
    tool.execute({ action, id });

module.exports = defineCommands({
  getApi: requireTool({ id: "settings" }),
  table: {
    list: {
      risk: "read",
      label: "Xem toàn bộ setting (id, nhãn, giá trị)",
      call: (t) => t.execute({ action: "list" }),
    },
    describe: {
      risk: "read",
      label: "Xem options/khoảng giá trị của 1 setting",
      args: ID,
      call: byId("describe"),
    },
    get: {
      risk: "read",
      label: "Đọc giá trị 1 setting",
      args: ID,
      call: byId("get"),
    },
    set: {
      risk: "write",
      label: "Đổi giá trị 1 setting",
      args: { id: "string", value: "string" }, // chuỗi JSON: 16, true, "on"
      call: (t, { id, value }) =>
        t.execute({ action: "set", id, value: parseJson(value) }),
    },
    reset: {
      risk: "write",
      label: "Đặt lại 1 setting về mặc định",
      args: ID,
      call: byId("reset"),
    },
  },
});