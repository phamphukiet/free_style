// workbench.js
// Điểm ghép nối DUY NHẤT — import side-effect để đăng ký toàn bộ custom element.
// Lit tự lo lifecycle qua connectedCallback, không cần gọi tay hàm init().

import "./parts/titlebar/titlebar.js";
import "./parts/activitybar/activitybar.js";
import "./parts/sidebar/sidebar.js";
import "./parts/editor-group/editor-group.js";
import "./parts/panel/panel.js";
import "./parts/statusbar/statusbar.js";
