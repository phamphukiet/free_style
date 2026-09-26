// spec.js — tool schema cho AI function-calling.
function getToolSpec() {
  return {
    name: "todo",
    description:
      "Theo dõi tiến độ tác vụ nhiều bước trong session hiện tại. " +
      "Dùng action=write MỖI KHI tiến độ thay đổi — ghi đè toàn bộ danh sách, " +
      "không phải thêm dòng. Dùng action=list nếu cần xem lại tiến độ.",
    parameters: {
      type: "object",
      properties: {
        action: { type: "string", enum: ["list", "write"] },
        items: {
          type: "array",
          description:
            "Bắt buộc cho action=write. Toàn bộ danh sách (ghi đè). " +
            "Chỉ 1 item được 'in_progress' cùng lúc.",
          items: {
            type: "object",
            properties: {
              content: { type: "string" },
              status: {
                type: "string",
                enum: ["pending", "in_progress", "done"],
              },
            },
            required: ["content", "status"],
          },
        },
      },
      required: ["action"],
    },
  };
}

module.exports = { getToolSpec };
