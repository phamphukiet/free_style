// run-action.js
// Không đăng ký thêm nút ▶: dùng lại nút ▶ có sẵn trên toolbar (tìm trong registry).
// Ngoài chế độ ext: để nút làm việc cũ. Trong chế độ ext: chặn sự kiện và chạy lại ext đang mở.
// Chỉ khi không có nút ▶ nào (module runner bị đóng băng) mới tự đăng ký một nút.

import { registry } from "@modules/registry.js";
// import { listExtensions } from "./ext-bridge.js";
import { startExtension, attempt, toast } from "./ext-actions.js";
import { isActive, MODE_EVENT } from "./ext-mode.js";

const OWN_EVENT = "extension:run-active";
const RUN_GLYPH = "▶";
const EXT_TITLE = "Chạy lại extension";
const norm = (path) =>
  String(path ?? "")
    .replace(/\\/g, "/")
    .toLowerCase();

const found = registry.getEditorActions().find((a) => a.glyph === RUN_GLYPH);
const action = found ?? {
  title: EXT_TITLE,
  glyph: RUN_GLYPH,
  event: OWN_EVENT,
};
if (!found) registry.registerEditorAction(action);
const baseTitle = action.title;

function handleRun(e) {
  if (!isActive()) {
    return found ? undefined : toast("Chỉ chạy được trong chế độ extension");
  }
  e.stopImmediatePropagation(); // chặn công dụng cũ của nút
  return attempt(async () => {
    const items = await listExtensions();
    const target = items.find((i) => norm(i.file) === norm(e.detail.filePath));
    if (!target) return toast("File đang mở không phải code của extension");
    await startExtension(target);
    toast(`Đã chạy "${target.name}"`);
  });
}

// capture: chạy trước listener thường của module runner trên cùng window.
window.addEventListener(action.event, handleRun, { capture: true });

window.addEventListener(MODE_EVENT, (e) => {
  action.title = e.detail.active ? EXT_TITLE : baseTitle;
  document
    .querySelectorAll("workbench-editor-pane")
    .forEach((el) => el.requestUpdate());
});
