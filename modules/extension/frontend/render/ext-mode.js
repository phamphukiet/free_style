// ext-mode.js
// Chế độ extension: tạm đổi gốc Explorer sang thư mục ext, KHÔNG ghi lastFolder.
// Không cần giữ "thư mục cũ" trong RAM: lastFolder chưa bị đổi nên thoát chỉ cần đọc lại.
// Chế độ chỉ sống khi tab Explorer đang hiện; rời tab hoặc mở project khác thì tự kết thúc.

import { getRoot } from "./ext-bridge.js";

export const MODE_EVENT = "workbench:explorer-mode";
const EXIT_EVENT = "workbench:explorer-mode-exit";
const TAB_EVENT = "workbench:sidebar-tab";
const OPEN_EVENT = "workbench:folder-opened";
const LABEL = "Chế độ extension";
const RESTORE_WAIT_MS = 1000;

let root = null; // khác null = đang ở chế độ
let tab = "explorer"; // tab sidebar hiện tại (mặc định của activitybar)

const emit = (name, detail) =>
  window.dispatchEvent(new CustomEvent(name, { detail }));
const norm = (p) =>
  String(p ?? "")
    .replace(/\\/g, "/")
    .toLowerCase();
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

function once({ name, timeout }) {
  return new Promise((resolve) => {
    const done = () => {
      window.removeEventListener(name, done);
      clearTimeout(timer);
      resolve();
    };
    const timer = setTimeout(done, timeout);
    window.addEventListener(name, done);
  });
}

function leave() {
  root = null;
  emit(MODE_EVENT, { active: false });
}

// Sidebar Explorer mount lại sẽ tự đọc lastFolder rồi announce; chờ xong mới đặt gốc ext để khỏi bị đè.
async function switchToExplorer() {
  if (tab === "explorer") return;
  const hasProject = await window.api.state.loadLastFolder();
  const restored = hasProject
    ? once({ name: OPEN_EVENT, timeout: RESTORE_WAIT_MS })
    : null;
  emit(TAB_EVENT, { tabId: "explorer" });
  await restored;
  await tick(); // để lệnh restore của sidebar chạy hết rồi mới đè
}

export const isActive = () => root !== null;

export async function enterMode() {
  if (root) return;
  const dir = await getRoot();
  const entries = await window.api.fs.readDirectory(dir);
  await switchToExplorer();
  root = dir;
  emit(MODE_EVENT, { active: true, label: LABEL });
  emit(OPEN_EVENT, { folderPath: dir, entries });
}

export async function exitMode() {
  if (!root) return;
  leave();
  const last = await window.api.state.loadLastFolder();
  emit(OPEN_EVENT, last ?? { folderPath: "", entries: [] });
}

window.addEventListener(EXIT_EVENT, exitMode);

window.addEventListener(TAB_EVENT, (e) => {
  tab = e.detail.tabId;
  if (root && tab !== "explorer") leave();
});

window.addEventListener(OPEN_EVENT, (e) => {
  if (root && norm(e.detail.folderPath) !== norm(root)) leave();
});
