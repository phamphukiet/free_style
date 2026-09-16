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

async function bootModules() {
  const activeIds = (await window.api.modules.active()) || [];
  await Promise.all(
    activeIds.map((id) =>
      moduleEntries[`/modules/${id}/frontend/index.js`]?.(),
    ),
  );
  loadLastFolder();
}

bootModules();