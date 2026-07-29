## Tổng kết Giai đoạn 0 — quy tắc & quyết định

**Cách làm việc đã thống nhất**
- Function first, make work first — dựng cái chạy được trước, tối ưu/tách lớp sau.
- Mỗi file tối đa 100 dòng code; ưu tiên tái sử dụng hàm; phần nào phình to thì tách thành thư mục riêng.
- Trình tự thiết kế: giao diện → cách tương tác với cấu trúc → file → hàm.
- Khi sửa code: chỉ show hàm/đoạn thay đổi, không show lại cả file.
- Không dùng `present_files` — code hiển thị trực tiếp trong chat, bạn tự tạo/sửa file trên máy.

**Quyết định kiến trúc**
- Đổi tên `main/` → `electron-main/` để không trùng khái niệm *main process* của Electron.
- Gộp `layout + view + ui_ux` thành `workbench/` — một điểm ghép nối duy nhất, tránh chồng lấn trách nhiệm.
- `module/` (kiểu "microservice") đổi hướng thành **plugin pattern qua registry** — các phần không gọi trực tiếp nhau, chỉ đăng ký/lấy nhau qua `registry.js`.
- Đây là **desktop app**, không phải web app → bắt buộc có `preload.js` làm cầu nối, `frame: false` để tự vẽ titlebar, và native menu (`Menu.setApplicationMenu`) — không có ở web app.

**Ràng buộc bảo mật Electron (không đổi)**
- `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true` — renderer không đụng trực tiếp Node.js/OS, mọi API phải expose qua `preload.js`.

**Kết quả Giai đoạn 0**
- `window.js`, `preload.js`, `menu.js`, `index.js`, `workbench.html`, `package.json` — đủ bộ chạy `npm start` ra cửa sổ desktop cơ bản (không titlebar OS, có native menu).

**Quyết định bổ sung — Giai đoạn 1**
- Ưu tiên dùng icon từ thư viện ngoài (Lucide) thay vì tự vẽ SVG hay dùng ảnh custom — nhất quán, đủ bộ, dễ thay khi cần.
- Cài qua npm (`lucide` — bản thuần JS/SVG, không phụ thuộc React), import trực tiếp trong từng part cần icon.