Giai đoạn 0 — Khung Electron (đã sửa cho đúng desktop app)
 electron-main/window.js — hàm createWindow(): tạo BrowserWindow với frame: false (tự vẽ titlebar), webPreferences: { preload, contextIsolation: true, nodeIntegration: false }
 electron-main/preload.js — hàm expose qua contextBridge.exposeInMainWorld(), tạm thời để trống object window.api = {} — đây là cầu nối bắt buộc phải có ngay từ đầu, dù chưa dùng đến
 electron-main/menu.js — hàm buildAppMenu(): tạo native menu tối thiểu (File, Edit, View), gọi Menu.setApplicationMenu()
 electron-main/index.js — gọi createWindow() + buildAppMenu() khi app ready
 package.json — script start, khai báo main trỏ đúng electron-main/index.js

→ Mốc kiểm tra: cửa sổ hiện lên không có titlebar OS mặc định, có native menu, window.api gọi được từ console renderer (dù rỗng) → xác nhận cầu nối main↔renderer thông suốt.

Giai đoạn 1 — Giao diện tĩnh (bổ sung custom titlebar)
 workbench/parts/titlebar/titlebar.html — thanh titlebar tự vẽ: icon app, tên project, nút minimize/maximize/close
 workbench/parts/titlebar/titlebar.js — hàm gọi qua window.api để điều khiển window (minimize/maximize/close) — đây là ví dụ đầu tiên dùng preload bridge thật
 (các phần activitybar/sidebar/editor-group/panel/statusbar như cũ, nhưng giờ nằm dưới titlebar thay vì trên cùng)

→ Mốc kiểm tra: bấm nút close/minimize trên titlebar tự vẽ hoạt động đúng như window thật — xác nhận toàn bộ chuỗi renderer → preload → main hoạt động.

Giai đoạn 2 — Ghép Monaco và xterm.js vào đúng vùng (vẫn chỉ để "hiện ra", chưa nối logic)
 Cài monaco-editor, xterm qua npm
 workbench/parts/editor-group/editor-group.js — hàm mountEditor(container): khởi tạo Monaco instance, gắn vào #editor-container
 workbench/parts/panel/panel.js — hàm mountTerminal(container): khởi tạo xterm instance, gắn vào #terminal-container (chưa cần nối shell thật, chỉ cần xterm hiện ra và gõ được ký tự trên giao diện)
 workbench/workbench.js — hàm initWorkbench(): gọi mountEditor() và mountTerminal() khi trang load xong

→ Kiểm tra mốc: Monaco hiện ra gõ code có highlight syntax, terminal hiện ra gõ chữ được (chưa cần chạy lệnh thật).

Giai đoạn 3 — Cách các phần "biết" nhau ở mức tối thiểu (chuẩn bị cho tương tác thật)

Đây là bước bắt đầu chạm vào cấu trúc modules/registry đã bàn, nhưng chỉ ở mức khung xương:

 modules/registry.js — hàm register(name, api) và get(name), dùng object thường (chưa cần phức tạp)
 workbench/workbench.js — đăng ký editor và terminal vào registry ngay sau khi mount xong
 Test tay: từ console gọi registry.get('editor') lấy ra được instance Monaco → xác nhận cơ chế kết nối hoạt động

→ Kiểm tra mốc: các part độc lập nhưng có thể lấy ra và điều khiển chéo nhau qua registry, không gọi trực tiếp file của nhau.

Giai đoạn 4 — Activitybar bấm chuyển sidebar (tương tác thật đầu tiên)
 workbench/parts/activitybar/activitybar.js — hàm onIconClick(iconId)
 workbench/parts/sidebar/sidebar.js — hàm showPanel(panelId) / hidePanel(panelId)
 Nối: click icon → gọi sidebar.showPanel() tương ứng (qua registry, không import trực tiếp)

→ Kiểm tra mốc: bấm activitybar đổi được nội dung sidebar — đây là tương tác UI-to-UI đầu tiên chạy thật, xác nhận toàn bộ luồng registry hoạt động đúng.