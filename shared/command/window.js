// window.js
// Tìm cửa sổ đích. Có windowId thì CHỈ cửa sổ đó (đã đóng = null, không nhảy sang cửa sổ khác).
// Không có windowId (extension gọi) thì lấy cửa sổ đang focus hoặc cửa sổ đầu tiên.

const { BrowserWindow, webContents } = require("electron");

function resolveWindow({ windowId }) {
  if (windowId != null) {
    const contents = webContents.fromId(windowId);
    return contents && !contents.isDestroyed()
      ? BrowserWindow.fromWebContents(contents)
      : null;
  }
  return (
    BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0] ?? null
  );
}

module.exports = { resolveWindow };
