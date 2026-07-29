import * as monaco from "monaco-editor";

// Giai đoạn 2: chỉ cần Monaco hiện ra, gõ có syntax highlight.
// Chưa đọc/ghi file thật — nội dung mẫu cứng.
function mountEditor(container) {
  return monaco.editor.create(container, {
    value: "// Editor sẵn sàng\n",
    language: "javascript",
    theme: "vs-dark",
    // automaticLayout: true, // tự resize theo container cha
    // lineNumbers: "off", // tắt số dòng
    // glyphMargin: false, // tắt vùng icon debug/breakpoint
    // folding: false, // tắt vùng gấp code (thường đi kèm margin)
    // lineDecorationsWidth: 0, // triệt tiêu khoảng trắng còn lại của margin
    // lineNumbersMinChars: 0,
  });
  // Ép tính lại layout ngay sau khi tạo, tránh trường hợp container
  // chưa ổn định kích thước tại thời điểm create() (flex layout của cha
  // có thể chưa resolve xong width/height lúc firstUpdated() chạy).
  requestAnimationFrame(() => instance.layout());
  return instance;
}

export { mountEditor };
