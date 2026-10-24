// clipboard.js
// State clipboard dùng chung cho cut/copy/paste, xuyên suốt mọi tree-item và sidebar.
// Không phải registry (registry dành cho workbench parts) — đây là module-level state.

let clipboard = null; // { path, isDirectory, mode: 'copy' | 'cut' }

export function setClipboard(path, isDirectory, mode) {
  clipboard = { path, isDirectory, mode };
  window.dispatchEvent(
    new CustomEvent("ed:clipboard-changed", { detail: clipboard }),
  );
}

export function getClipboard() {
  return clipboard;
}

export function clearClipboard() {
  clipboard = null;
  window.dispatchEvent(
    new CustomEvent("ed:clipboard-changed", { detail: null }),
  );
}
