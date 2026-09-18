function register() {}
const { registerMention } = require("../../../shared/mention-registry.js");

registerMention("files", { hint: "quản lý tệp tin (tạo/sửa/xoá)" });

module.exports = { register };
