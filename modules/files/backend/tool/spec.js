// spec.js — tool schema cho AI function-calling (JSON Schema chữ thường).

function getToolSpec() {
  return {
    name: "files",
    description:
      "Xem cấu trúc thư mục, đọc/ghi/di chuyển/xoá file trong project đang mở. " +
      "Mọi action ngoài tree đều nhận DANH SÁCH: các file độc lập thì gom vào MỘT lần gọi, không gọi từng file. " +
      "Dùng action=tree khi hỏi 'cấu trúc file dự án/project'. " +
      "Dùng action=read khi hỏi 'xuất/xem nội dung file ...' (truyền paths). " +
      "Dùng action=write khi được yêu cầu 'code/tạo/viết file ...' — tự sinh nội dung phù hợp rồi truyền vào files; file rất lớn thì ghi riêng. " +
      "Dùng action=move khi được yêu cầu 'bỏ/chuyển/di chuyển file X vào thư mục Y' — Y tự được tạo nếu chưa có. " +
      "Dùng action=delete khi được yêu cầu xoá, bắt buộc confirmed=true.",
    parameters: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["tree", "read", "write", "move", "delete"],
        },
        paths: {
          type: "array",
          items: { type: "string" },
          description:
            "Danh sách đường dẫn tương đối gốc project. Bắt buộc cho read/move/delete (VD: ['login/index.html','login/style.css']).",
        },
        files: {
          type: "array",
          description:
            "Bắt buộc cho action=write: danh sách file cần tạo/ghi đè.",
          items: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "Đường dẫn tương đối gốc project.",
              },
              content: {
                type: "string",
                description: "Nội dung đầy đủ của file.",
              },
            },
            required: ["path", "content"],
          },
        },
        destFolder: {
          type: "string",
          description:
            "Thư mục đích (tương đối gốc project), bắt buộc cho action=move. Các mục trong paths được chuyển vào đây, giữ nguyên tên.",
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
