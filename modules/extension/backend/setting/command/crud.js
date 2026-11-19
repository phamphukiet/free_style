const {
  defineCommands,
  requireService,
  parseJson,
} = require("../../../../../shared/command/crud.js");

const NEEDS = [
  "list",
  "languages",
  "read",
  "create",
  "template",
  "save",
  "setEnabled",
  "remove",
  "setValue",
];
const ID = { id: "string" };

module.exports = defineCommands({
  getApi: requireService({ id: "extension", needs: NEEDS }),
  table: {
    list: {
      risk: "read",
      label: "Xem danh sách extension",
      call: (a) => a.list(),
    },
    languages: {
      risk: "read",
      label: "Xem ngôn ngữ extension hỗ trợ",
      call: (a) => a.languages(),
    },
    template: {
      risk: "read",
      label: "Lấy code mẫu để viết extension",
      args: { type: "object", properties: { language: { type: "string" } } },
      call: (a, { language }) => a.template({ language }),
    },
    read: {
      risk: "read",
      label: "Đọc code extension",
      args: ID,
      call: (a, { id }) => a.read({ id }),
    },
    create: {
      risk: "exec",
      label: "Tạo extension mới từ code",
      args: { code: "string" },
      call: (a, { code }) => a.create({ code }),
    },
    save: {
      risk: "exec",
      label: "Sửa code extension",
      args: { id: "string", code: "string" },
      call: (a, { id, code }) => a.save({ id, code }),
    },
    enable: {
      risk: "exec",
      label: "Bật extension",
      args: ID,
      call: (a, { id }) => a.setEnabled({ id, enabled: true }),
    },
    disable: {
      risk: "write",
      label: "Tắt extension",
      args: ID,
      call: (a, { id }) => a.setEnabled({ id, enabled: false }),
    },
    remove: {
      risk: "destructive",
      label: "Xoá extension",
      args: ID,
      call: (a, { id }) => a.remove({ id }),
    },
    setValue: {
      risk: "write",
      label: "Chỉnh thông số của extension",
      args: { id: "string", key: "string", value: "string" },
      call: (a, { id, key, value }) =>
        a.setValue({ id, key, value: parseJson(value) }),
    },
  },
});
