// ai-bridge.js
// Trách nhiệm duy nhất: MẶT TIẾP XÚC DUY NHẤT giữa settings và bên ngoài
// (chat module gọi tool-calling). Chứa spec + hàm execute cho action
// list/get/set (root: AI chỉ được "set", không create/update/delete).
//
// registerAction() là registry MỞ để module KHÁC (ngoài modules/settings)
// tự thêm action AI gọi được — settings không cần biết ai đăng ký, giống
// pattern shared/monaco-theme.js, shared/terminal-theme.js.

const commands = require("./commands");
const { notifyChanged } = require("./notify");

const extraActions = {};
const extraHints = [];

function registerAction(name, handler, hint) {
  extraActions[name] = handler;
  if (hint) extraHints.push(hint);
}

function getToolSpec() {
  const hint = `${commands.getCompactSummary()} ${extraHints.join(" ")}`.trim();
  const actions = ["list", "get", "set", ...Object.keys(extraActions)];
  return {
    name: "settings",
    description:
      `Đọc và đổi giá trị cấu hình app. Với action ngoài list/get/set, đọc mô tả ` +
      `action đó trong: ${extraHints.join(" ") || "(không có)"}. Trạng thái hiện tại: ${hint}`,
    parameters: {
      type: "object",
      properties: {
        action: { type: "string", enum: actions },
        id: { type: "string", description: "id setting hoặc id preset mới" },
        value: { description: "Giá trị mới, dùng khi action=set" },
        label: {
          type: "string",
          description: "Nhãn hiển thị, dùng cho action tạo preset",
        },
        params: {
          type: "object",
          description:
            "Tham số bổ sung tuỳ action (VD màu sắc cho action tạo theme)",
        },
      },
      required: ["action"],
    },
  };
}

function execute(action, args) {
  switch (action) {
    case "list":
      return { items: commands.getSummary() };
    case "get":
      return { id: args.id, value: commands.getValue(args.id) };
    case "set": {
      const value = commands.setValue(args.id, args.value);
      notifyChanged(args.id, value);
      return { id: args.id, value };
    }
    default: {
      const handler = extraActions[action];
      if (!handler) throw new Error(`action "${action}" không hợp lệ`);
      return handler(args);
    }
  }
}

module.exports = { getToolSpec, execute, registerAction };
