// syntax.js
// Schema "Syntax Highlighting" — mỗi bảng màu tự mang theo base (dark/light) riêng,
// KHÔNG phụ thuộc editor.colorTheme của 001 → đổi theme nền không ảnh hưởng màu code.
// Tạo bảng màu mới: dùng nút "+ Mẫu" có sẵn, nhập JSON dạng:
// {"base":"dark","comment":"6a9955","string":"ce9178","number":"b5cea8",
//  "keyword":"569cd6","identifier":"9cdcfe","type":"4ec9b0","delimiter":"d4d4d4","regexp":"d16969"}
// Thiếu "base" → mặc định coi là "dark".
module.exports = {
  id: "syntax.palette",
  group: "Appearance",
  label: "Syntax Highlighting",
  type: "select",
  default: "classic",
  options: [
    {
      value: "classic",
      label: "Classic",
      // built-in vẫn set sẵn base để tiện đối chiếu, nhưng KHÔNG bắt buộc khớp editor.colorTheme
      json: '{"base":"dark","comment":"6a9955","string":"ce9178","number":"b5cea8","keyword":"569cd6","identifier":"9cdcfe","type":"4ec9b0","delimiter":"d4d4d4","regexp":"d16969"}',
    },
    {
      value: "pastel",
      label: "Pastel (nền sáng)",
      json: '{"base":"light","comment":"6b7280","string":"b45309","number":"166534","keyword":"1d4ed8","identifier":"a21caf","type":"0e7490","delimiter":"374151","regexp":"be123c"}',
    },
    {
      value: "vivid",
      label: "Vivid",
      json: '{"base":"dark","comment":"5c6773","string":"ffb454","number":"a0ff54","keyword":"ff54a0","identifier":"54ffe0","type":"54a0ff","delimiter":"ffffff","regexp":"ff5454"}',
    },
  ],
};
