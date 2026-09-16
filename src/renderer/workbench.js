// workbench.js
import "./parts/titlebar/titlebar.js";
import "./parts/activitybar/activitybar.js";
import "./parts/sidebar/sidebar.js";
import "./parts/editor-group/editor-group.js";
import "./parts/panel/panel.js";
import "./parts/statusbar/statusbar.js";
import "./parts/rightsidebar/rightsidebar.js";
import "./parts/toast/toast.js";
import { loadLastFolder } from "@shared/folder-actions.js";

const moduleEntries = import.meta.glob("@modules/*/frontend/index.js");
console.log("[workbench] moduleEntries keys:", Object.keys(moduleEntries));

async function bootModules() {
  let activeIds = [];
  try {
    activeIds = (await window.api.modules.active()) || [];
    console.log("[workbench] activeIds từ main process:", activeIds);
  } catch (e) {
    console.error("[workbench] Gọi window.api.modules.active() lỗi:", e);
    return;
  }

  const results = await Promise.allSettled(
    activeIds.map(async (id) => {
      // Không phụ thuộc key tuyệt đối — tìm entry có path chứa đúng module id,
      // tránh vỡ toàn bộ khi Vite resolve alias glob ra key khác dự kiến.
      const key = Object.keys(moduleEntries).find((k) =>
        k.endsWith(`/modules/${id}/frontend/index.js`) ||
        k.endsWith(`${id}/frontend/index.js`),
      );
      if (!key) {
        console.warn(`[workbench] Không tìm thấy frontend/index.js cho module "${id}"`);
        return;
      }
      console.log(`[workbench] Đang load module "${id}" qua key: ${key}`);
      await moduleEntries[key]();
      console.log(`[workbench] Load module "${id}" THÀNH CÔNG`);
    }),
  );

  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(`[workbench] Module "${activeIds[i]}" load LỖI:`, r.reason);
    }
  });

  loadLastFolder();
}

bootModules();