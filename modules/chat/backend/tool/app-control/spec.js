// spec.js — schema tĩnh của tool "app" (JSON Schema chữ thường).
// args khai báo là chuỗi JSON: object rỗng không có properties có thể bị Gemini từ chối,
// mà lỗi spec làm hỏng MỌI request chat. actions.js nhận cả chuỗi lẫn object.

function getToolSpec() {
  return {
    name: "app",
    description:
      "Thao tác chức năng của app qua lệnh do các module cung cấp. " +
      "list: xem lệnh khả dụng (lọc theo module). describe: xem tham số của 1 lệnh. " +
      "run: chạy lệnh theo id. Luôn list trước, không đoán id.",
    parameters: {
      type: "object",
      properties: {
        action: { type: "string", enum: ["list", "describe", "run"] },
        module: {
          type: "string",
          description: "Tên module để lọc (action=list), VD 'editor'.",
        },
        id: {
          type: "string",
          description: "Id lệnh dạng module.tên (describe/run).",
        },
        args: {
          type: "string",
          description:
            'Tham số của lệnh dạng chuỗi JSON object (action=run), VD \'{"bg":"1e1e1e"}\'.',
        },
      },
      required: ["action"],
    },
  };
}

module.exports = { getToolSpec };
