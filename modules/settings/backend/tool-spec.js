// tool-spec.js
// Đặc tả lệnh "settings" theo chuẩn JSON Schema — dùng chung cho mọi provider.
// 1 tool duy nhất, action dạng enum: giảm token spec, agent chỉ học 1 lần.
// hint: chuỗi compact state (từ commands.getCompactSummary()), nhúng thẳng
// vào description để agent set/get đúng ngay lượt đầu, khỏi cần gọi "list".

function getToolSpec(hint, extraActions = []) {
  return {
    name: "settings",
    description: hint
      ? `Đọc hoặc đổi setting của app. Trạng thái hiện tại: ${hint}`
      : `Đọc hoặc đổi setting của app. Gọi action="list" trước nếu chưa biết id nào tồn tại.`,
    parameters: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["list", "get", "set", ...extraActions],
        },
        id: {
          type: "string",
          description: "id của setting hoặc theme, tuỳ action",
        },
        value: { description: "giá trị mới, dùng cho action=set" },
        label: {
          type: "string",
          description: "tên hiển thị, dùng cho action=create_theme",
        },
        tokens: {
          type: "string",
          description:
            'Chuỗi màu dạng "--bg-primary:#112233,--accent:#33ccff", dùng cho action=create_theme',
        },
      },
      required: ["action"],
    },
  };
}

module.exports = { getToolSpec };