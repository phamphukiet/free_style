# free_style
project/
├── electron-main/          # Main process THẬT (đổi tên tránh trùng "main")
│   ├── window.js
│   ├── ipc.js
│   └── fs.js / terminal.js
│
├── workbench/               # renderer — thay cho main/layout+view+ui_ux
│   ├── parts/                # activitybar, sidebar, editor-group, statusbar, panel
│   └── workbench.js           # nơi DUY NHẤT ghép các parts lại, quyết định show/hide/tương tác
│
├── modules/                  # đổi tên khỏi "microservice", giữ tinh thần plugin
│   ├── registry.js            # nơi module đăng ký mình vào, expose API
│   └── <feature>/              # mỗi module tự chứa, chỉ nói chuyện qua registry
│
└── shared/
    └── ipc-channels.js