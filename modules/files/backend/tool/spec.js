// spec.js — tool schema cho AI function-calling (JSON Schema chữ thường).

function getToolSpec() {
  return {
    name: "files",
    description:
      "Xem cấu trúc thư mục, xuất nội dung, tạo/ghi, di chuyển, hoặc xoá file/thư mục trong project đang mở. " +
      "Dùng action=tree khi hỏi 'cấu trúc file dự án/project'. " +
      "Dùng action=read khi hỏi 'xuất/xem nội dung file ...'. " +
      "Dùng action=write khi được yêu cầu 'code/tạo/viết file ...' — tự sinh nội dung phù hợp rồi truyền vào content. " +
      "Dùng action=move khi được yêu cầu 'bỏ/chuyển/di chuyển file X vào thư mục Y' — Y sẽ tự được tạo nếu chưa có. " +
      "Dùng action=delete khi được yêu cầu xoá file hoặc thư mục, bắt buộc confirmed=true.",
    parameters: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["tree", "read", "write", "move", "delete"],
        },
        path: {
          type: "string",
          description:
            "Đường dẫn tương đối so với gốc project. Bắt buộc cho read/write/delete, và là NGUỒN cho move (VD: 'hello_world.py').",
        },
        content: {
          type: "string",
          description:
            "Nội dung file, bắt buộc cho action=write. Tự sinh code phù hợp với yêu cầu người dùng.",
        },
        destFolder: {
          type: "string",
          description:
            "Thư mục đích (tương đối gốc project), bắt buộc cho action=move (VD: 'test'). File sẽ được chuyển vào đây, giữ nguyên tên.",
        },
        maxDepth: {
          type: "number",
          description:
            "Độ sâu tối đa khi liệt kê cây thư mục (action=tree), mặc định 5.",
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
