// tool-bridge.js
// Cầu nối để AI model gọi rule qua function-calling (list/create/update/delete),
// dùng chung logic CRUD với rules-store.js — không viết lại.

const rulesStore = require("./catalog/rules-store");
const { installRule, uninstallRule } = require("./install/install");

function getToolSpec() {
  return {
    name: "rule",
    description:
      "Xem, tạo, sửa hoặc xoá rule (quy tắc ứng xử) đang gán cho agent hiện tại.",
    parameters: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["list", "create", "update", "delete"],
          description: "Hành động cần thực hiện",
        },
        id: {
          type: "string",
          description: "id rule (bắt buộc khi update/delete)",
        },
        name: { type: "string", description: "Tên rule" },
        content: { type: "string", description: "Nội dung rule" },
      },
      required: ["action"],
    },
  };
}

function execute(action, args, agentId) {
  switch (action) {
    case "list":
      return rulesStore
        .list()
        .filter(
          (r) => r.enabled !== false && (r.agentIds || []).includes(agentId),
        )
        .map((r) => ({ id: r.id, name: r.name, content: r.content }));

    case "create": {
      const saved = rulesStore.upsert({
        name: args.name || "Rule mới",
        content: args.content || "",
        agentIds: [agentId],
        pinned: true,
      });
      try {
        installRule(saved);
      } catch {
        /* chưa mở project */
      }
      return { id: saved.id, name: saved.name };
    }

    case "update": {
      if (!args.id) throw new Error("Thiếu id để sửa rule");
      const saved = rulesStore.upsert({
        id: args.id,
        ...(args.name ? { name: args.name } : {}),
        ...(args.content !== undefined ? { content: args.content } : {}),
      });
      try {
        installRule(saved);
      } catch {
        /* chưa mở project */
      }
      return { id: saved.id, name: saved.name };
    }

    case "delete":
      if (!args.id) throw new Error("Thiếu id để xoá rule");
      rulesStore.remove(args.id);
      try {
        uninstallRule(args.id);
      } catch {
        /* chưa mở project */
      }
      return { deleted: args.id };

    default:
      throw new Error(`Action "${action}" không hợp lệ`);
  }
}

module.exports = { getToolSpec, execute };
