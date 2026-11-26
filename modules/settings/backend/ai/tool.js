// tool.js
// AI tool "settings". Spec TĨNH (không nhét giá trị hiện tại như ai-bridge cũ).
// Quyền theo def.aiAccess: none = ẩn hoàn toàn, read = chỉ đọc, write = đọc + ghi.
// AI chỉ ghi tầng global.
const { createLister } = require("../../../../shared/command/list.js");
const { createItems } = require("./items");

const SPEC = Object.freeze({
  name: "settings",
  description:
    "Đọc và đổi cấu hình app. list: tìm setting theo query (1 từ khóa ngắn: tên, nhóm hoặc giá trị, VD 'theme', 'monokai'); không có query chỉ trả tên nhóm. describe: xem options/gợi ý của 1 setting. " +
    "get/set/reset: thao tác theo id. addPreset: ...(giữ nguyên phần còn lại)",
  parameters: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: ["list", "describe", "get", "set", "reset", "addPreset"],
      },
      id: { type: "string", description: "id setting." },
      query: { type: "string", description: "Từ khóa ngắn (action=list)." },
      value: { description: "Giá trị mới (action=set)." },
      presetId: {
        type: "string",
        description: "id mẫu mới (action=addPreset).",
      },
      label: { type: "string", description: "Nhãn mẫu (action=addPreset)." },
      data: { type: "object", description: "Dữ liệu mẫu (action=addPreset)." },
    },
    required: ["action"],
  },
});

function createSettingsTool({ engine, simplify }) {
  function access({ id, write }) {
    const def = engine.getDefinition({ id });
    const allowed =
      def && (def.aiAccess === "write" || (!write && def.aiAccess === "read"));
    if (!allowed)
      throw new Error(
        `Không có quyền ${write ? "ghi" : "đọc"} setting "${id}".`,
      );
    return def;
  }

  function describe({ id }) {
    const def = access({ id });
    return {
      id,
      label: def.label,
      type: def.type,
      default: def.default,
      min: def.min,
      max: def.max,
      hint: def.aiHint,
      options: def.options?.map((o) => ({ value: o.value, label: o.label })),
    };
  }

    const list = createLister({ ...createItems({ engine }), simplify });

  function execute(args = {}) {
    const { action, id } = args;
    switch (action) {
      case "list":
        return list({ query: args.query });
      case "describe":
        return describe({ id });
      case "get":
        return { id, value: (access({ id }), engine.inspect({ id }).value) };
      case "set":
        return {
          id,
          value:
            (access({ id, write: true }),
            engine.set({ id, value: args.value })),
        };
      case "reset":
        return {
          id,
          value: (access({ id, write: true }), engine.reset({ id })),
        };
      case "addPreset": {
        access({ id, write: true });
        const option = {
          value: args.presetId,
          label: args.label,
          data: args.data,
        };
        return { id, presetId: engine.addPreset({ id, option }) };
      }
      default:
        throw new Error(`Action "${action}" không tồn tại.`);
    }
  }

  return { spec: SPEC, getToolSpec: () => SPEC, execute };
}

module.exports = { createSettingsTool };