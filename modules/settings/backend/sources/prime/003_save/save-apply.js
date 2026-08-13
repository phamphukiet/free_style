// Toàn bộ logic điều phối 3 chế độ nằm ở đây — editor không biết gì về chúng,
// chỉ biết "khi có lệnh trigger thì lưu model đang dirty".
import { registry } from "@modules/registry.js";

let intervalTimer = null;

function trigger() {
  registry.publishConfig("editor-save-trigger", Date.now());
}

function clearIntervalTimer() {
  clearInterval(intervalTimer);
  intervalTimer = null;
}

function setupOnSwitchListeners(active) {
  const handler = () => active() && trigger();
  window.addEventListener("workbench:open-file", handler); // đổi file trong sidebar
  window.addEventListener("workbench:sidebar-tab", handler); // đổi module (activitybar)
  window.addEventListener("blur", handler); // chuyển sang app khác
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && active()) trigger(); // về màn hình chính/minimize
  });
}

async function applySaveMode() {
  clearIntervalTimer();
  const all = await window.api.settings.getAll();
  const mode = all["editor.saveMode"];
  const seconds = Number(all["editor.saveIntervalSec"] || 10);

  if (mode === "interval") {
    intervalTimer = setInterval(trigger, seconds * 1000);
  }
  // "off": không làm gì — editor giữ dirty, không ai gọi trigger.
  // "onswitch": listener đã gắn sẵn ở init(), tự kiểm tra mode qua closure `currentMode`.
  currentMode = mode;
}

let currentMode = "off";

function init() {
  setupOnSwitchListeners(() => currentMode === "onswitch");
  applySaveMode();
  window.api.settings.onChanged((detail) => {
    if (
      detail.id === "editor.saveMode" ||
      detail.id === "editor.saveIntervalSec"
    ) {
      applySaveMode();
    }
  });
}

init();
