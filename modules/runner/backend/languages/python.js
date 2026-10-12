// modules/runner/backend/languages/python.js
module.exports = {
  id: "python",
  label: "Python",
  extensions: [".py"],
  mode: "terminal", // "terminal" | "preview" | "server" (2 mode sau: xem phần ý tưởng)
  systemCommand: "python", // dò trên PATH trước
  exeName: "python.exe", // vị trí file chạy trong thư mục runtime tự cài
  download: {
    win32: {
      url: "https://www.python.org/ftp/python/3.12.8/python-3.12.8-embed-amd64.zip",
      sizeMB: 11, // chỉ để hiển thị
      strip: 0, // số cấp thư mục gốc cần bỏ khi giải nén
      sha256: "", // điền sau khi tự kiểm tra, rỗng = bỏ qua kiểm tra
      cleanup: ["python312._pth"], // xem ghi chú ở cuối
    },
  },
  buildArgs: (file) => [file],
};
