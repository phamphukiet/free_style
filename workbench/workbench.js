// workbench.js
// Điểm ghép nối DUY NHẤT — nơi gọi init các part sau khi trang load xong.

import "./parts/titlebar/titlebar.js";
import "./parts/activitybar/activitybar.js";
import "./parts/sidebar/sidebar.js";
import "./parts/editor-group/editor-group.js";
import "./parts/panel/panel.js";
import "./parts/statusbar/statusbar.js";

function initWorkbench() {
    initTitlebar();
    renderActivitybar();
    renderSidebar();
    renderEditorGroup();
    renderPanel();
    renderStatusbar();
}

document.addEventListener("DOMContentLoaded", initWorkbench);
