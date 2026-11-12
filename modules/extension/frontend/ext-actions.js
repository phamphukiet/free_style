// ext-actions.js
// Hành động dùng chung giữa trang ext và nút Run ở toolbar editor.
// Tái dùng editor có sẵn: chỉ bắn event, không import file của module editor.

import { registry } from "@modules/registry.js";
import { setEnabled } from "./ext-bridge.js";

const emit = (name, detail) =>
  window.dispatchEvent(new CustomEvent(name, { detail }));

export const toast = (message) => emit("workbench:toast", { message });

export async function attempt(task) {
  try {
    await task();
  } catch (error) {
    toast(error.message);
  }
}

// Chuyển sang Explorer rồi mở file code ext ở pane đang active.
export function openInEditor({ file }) {
  const fileName = file.split(/[\\/]/).slice(-2).join("/"); // <id>/index.js
  emit("workbench:sidebar-tab", { tabId: "explorer" });
  emit("workbench:open-file", { filePath: file, fileName });
}

// Ghi các file đang sửa xuống đĩa để ext chạy đúng code mới nhất.
export function saveEditors() {
  registry.getConfigConsumer("editor-save-trigger")?.();
}

export async function startExtension({ id }) {
  saveEditors();
  await setEnabled({ id, enabled: true });
}

export const stopExtension = ({ id }) => setEnabled({ id, enabled: false });
