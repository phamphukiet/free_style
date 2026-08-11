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

## Tổng kết Giai đoạn 1 — quy tắc & quyết định

**Kiến trúc renderer**
- Dùng bundler **Vite** cho renderer (`workbench/`), build output vào `dist/workbench/`. `electron-main/` không qua Vite, chạy Node thuần.
- Renderer dùng ESM (`import`/`export`), cần bundler nên không dùng `<script>` thường.
- `electron-main/window.js` load file đã build tại `dist/workbench/workbench.html`, không load trực tiếp từ `workbench/`.

**Thư viện UI — Lit**
- Mỗi part trong `workbench/parts/<tên>/` là 1 **Web Component (Custom Element)** viết bằng **Lit**, đăng ký qua `customElements.define("workbench-<tên>", ...)`.
- Cấu trúc chuẩn mỗi part gồm 3 file:
  - `<tên>.css` — style riêng, scoped tự nhiên nhờ Shadow DOM, import vào JS qua `?inline`.
  - `<tên>.template.js` — chỉ chứa hàm trả về Lit template (`html\`...\``), nhận `host` (instance element) để bind sự kiện/đọc property.
  - `<tên>.js` — class kế thừa `LitElement`, chứa `static properties`, logic xử lý (event handler), gọi `render()` trả về template từ file `.template.js`.
- HTML không còn tách file `.html` riêng (đã thử fetch async nhưng bị lỗi timing + Vite không tự bundle asset ngoài entry) → chấp nhận HTML nằm trong `.template.js` dạng template literal của Lit, đổi lại giải quyết luôn vấn đề timing vì không cần fetch bất đồng bộ.
- `workbench/workbench.html` chỉ còn thẻ custom element rỗng (`<workbench-titlebar>`, `<workbench-sidebar>`...), không còn markup lặp lại.
- `workbench/workbench.js` chỉ còn import side-effect để đăng ký toàn bộ custom element, không còn hàm `init()`/`render()` gọi tay — Lit tự lo lifecycle qua `connectedCallback`.

**Icon**
- Ưu tiên dùng icon từ thư viện ngoài thay vì tự vẽ hay dùng ảnh custom.
- Ban đầu định dùng `lucide` (bản DOM API, gọi `createIcons()` quét `[data-lucide]`) nhưng **không hoạt động trong Shadow DOM** của Lit (không xuyên Shadow DOM để quét).
- Chuyển sang **`lucide-static`**: import trực tiếp file SVG dạng string qua `?raw` (cú pháp Vite hỗ trợ sẵn), nhúng vào template bằng directive `unsafeSVG` của Lit. Áp dụng thống nhất cho mọi part cần icon.

**Cập nhật dữ liệu từ module (chuẩn bị cho Giai đoạn 3+)**
- Mỗi part expose state qua Lit `properties` (ví dụ `sidebar.items`, `statusbar.branch`...); module khác muốn đổi nội dung part chỉ cần set lại property qua `registry.get('<part>')` — không tự viết DOM logic, không import trực tiếp file của part khác.

**Layout tổng thể**
- Bố trí kiểu VSCode: `titlebar` (trên cùng, cố định) → `#workbench-body` (flex ngang: `activitybar` cố định rộng → `sidebar` cố định rộng → `#editor-panel-column` chiếm phần còn lại) → `statusbar` (dưới cùng, cố định).
- `#editor-panel-column` là flex dọc: `editor-group` (chiếm hết chiều cao còn lại) trên, `panel` (chiều cao cố định) dưới.
- CSS layout tổng đặt trực tiếp trong `<style>` của `workbench.html` (ngoài Shadow DOM của từng part), vì đây là quan hệ bố trí giữa các part với nhau, không thuộc về style riêng của 1 part.

**Kết quả Giai đoạn 1**
- Đủ 6 part: titlebar (tương tác thật — minimize/maximize/close qua IPC), activitybar, sidebar, editor-group, panel, statusbar (5 part còn lại tĩnh, chừa chỗ đúng layout).
- `shared/ipc-channels.js` và `electron-main/ipc.js` được thêm để xử lý lệnh window control từ titlebar.

**Chuyển đổi hạ tầng — electron-vite**
- Chuyển từ Vite thuần + `concurrently`/`wait-on` sang **electron-vite** để có HMR/auto-restart cho cả main, preload, renderer (không chỉ renderer).
- Cấu trúc đổi: `electron-main/` → `src/main/`, `electron-main/preload.js` → `src/preload/index.js`, `workbench/` → `src/renderer/`. `modules/` và `shared/` giữ nguyên ở gốc project.
- Dùng alias `@modules` và `@shared` (khai báo trong `electron.vite.config.js`) thay cho đường dẫn tương đối `../../../` khi import giữa renderer/main và modules/shared — tránh lỗi đếm sai cấp thư mục.

## Tổng kết Giai đoạn 2 — quy tắc & quyết định
**Ưu tiên code tái sử dụng**
**Hạn chế thay đổi code ở src/parts**
**Các folder trong modules lập trình có thể hoạt động độc lập mà không cần biết nhau**

# Tổng kết giai đoạn 3
**Tính năng module có thể hoạt động runtime khi các module khác kích event**
**Khi thêm 1 prime module hay 1 custom setting**
Cần logic áp dụng riêng (không chỉ là dropdown/list hiển thị ở Settings UI):
- Tạo file xxx-apply.js ngay trong thư mục sources/<origin>/<module>/ của chính setting đó.
- File tự viết logic đọc giá trị + tự đăng ký window.api.settings.onChanged để nghe real-time — y hệt mẫu theme.
- Không đụng apply-loader.js, không đụng frontend/index.js.