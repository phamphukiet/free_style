// spec.js — tool schema cho AI function-calling (JSON Schema chữ thường).

function getToolSpec() {
  return {
    name: "agent",
    description:
      "Quản lý agent AI: xem danh sách, tạo, sửa, xoá, test kết nối.",
    parameters: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["list", "create", "update", "delete", "test"],
        },
        id: {
          type: "string",
          description: "id agent, cần cho update/delete/test.",
        },
        name: { type: "string", description: "Tên agent, cần cho create." },
        providerHint: { type: "string", description: "VD 'openai', 'gemini'." },
        keyHint: { type: "string", description: "Tên gợi nhớ của key." },
        modelHint: { type: "string", description: "VD 'gpt-4o', 'flash'." },
        message: {
          type: "string",
          description: "Nội dung gửi thử khi action=test.",
        },
        confirmed: {
          type: "boolean",
          description: "Bắt buộc true để thực sự xoá (action=delete).",
        },
      },
      required: ["action"],
    },
  };
}

module.exports = { getToolSpec };
