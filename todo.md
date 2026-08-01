Giai đoạn 2 — Ghép Monaco & xterm.js (module M1_IDE)

Giai đoạn A (làm ngay): chuyển sidebar vào module editor (mirror đúng pattern editor-group) + lưu/khôi phục folder gần nhất kiểu VSCode (file JSON trong userData, main process quản lý).

Giai đoạn B (làm sau khi A chạy ổn): tree đệ quy + context menu CRUD + kéo-thả + cut/copy/paste — phần này code khá lớn, nên tách riêng để test được từng phần.

B1 — tree đệ quy (expand/collapse, lazy-load con)
B2 — context menu CRUD (New File/Folder, Rename, Delete)
B3 — kéo-thả (move file/folder)
B4 — cut/copy/paste