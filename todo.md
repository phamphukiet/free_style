Giai đoạn 1 — Khung tĩnh đủ 6 part (mở rộng từ titlebar-only)

titlebar (tương tác thật — theo đúng mốc gốc)

titlebar.html — icon app, tên project, 3 nút minimize/maximize/close
titlebar.js — hàm initTitlebar(), gọi window.api.minimize/maximize/close()

activitybar (tĩnh)

activitybar.html — cột icon dọc (Explorer, Search, Git...)
activitybar.js — hàm renderActivitybar(), chỉ hiện icon + 1 icon active mặc định, chưa bắt click

sidebar (tĩnh)

sidebar.html — khung panel cạnh activitybar
sidebar.js — hàm renderSidebar(), hiện nội dung giả (list file cứng)

editor-group (tĩnh, chừa chỗ)

editor-group.html — div rỗng, background khác biệt để thấy vùng
editor-group.js — hàm renderEditorGroup(), chưa mount Monaco

panel (tĩnh, chừa chỗ)

panel.html — div rỗng phía dưới
panel.js — hàm renderPanel(), chưa mount xterm

statusbar (tĩnh)

statusbar.html — thanh mỏng dưới cùng
statusbar.js — hàm renderStatusbar(), hiện vài mục cứng (branch giả, ngôn ngữ giả)

Ghép layout

workbench/workbench.js — hàm initWorkbench(): gọi render tất cả 6 part đúng vị trí CSS grid (titlebar trên → giữa: activitybar|sidebar|editor-group|panel → statusbar dưới)
workbench/workbench.html — cập nhật CSS grid layout thay khung tạm hiện tại