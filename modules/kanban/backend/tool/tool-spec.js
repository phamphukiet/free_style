// tool-spec.js — schema AI tool "kanban".

function getToolSpec() {
  return {
    name: "kanban",
    description:
      "Quản lý task trên Kanban board của project: xem, tạo, sửa, chuyển cột, " +
      "đề xuất kết quả, bình luận, hoặc dọn task đã hoàn tất khi user yêu cầu rõ ràng.",
    parameters: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: [
            "list",
            "create",
            "update",
            "move",
            "propose-result",
            "comment",
            "clear-done",
          ],
        },
        taskId: { type: "string" },
        title: { type: "string" },
        description: { type: "string" },
        agentId: {
          type: "string",
          description:
            "Id agent phù hợp nhất, dùng cho action=create/update. Manager có " +
            "quyền phân công lại agent khác cho task qua action=update.",
        },
        toColumnId: {
          type: "string",
          enum: ["ALL", "doing", "agent_working", "result"],
          description:
            "Không bao gồm 'done' — action=move không được set done.",
        },
        summary: {
          type: "string",
          description: "Tóm tắt kết quả, cho action=propose-result.",
        },
        message: {
          type: "string",
          description: "Nội dung bình luận, cho action=comment.",
        },
        confirmed: {
          type: "boolean",
          description: "Bắt buộc true để thực sự dọn done (action=clear-done).",
        },
      },
      required: ["action"],
    },
  };
}

module.exports = { getToolSpec };