// on-code-changed.js — file code bị sửa từ ngoài (watcher): nạp lại, lỗi chỉ ghi log.
// Lỗi code của ext đã hiện ở dòng ext (catalog.error), không cần ném tiếp.

function createOnCodeChanged({ repo, saveCode, settings }) {
  return function onCodeChanged({ id }) {
    if (!repo.get({ id })) return Promise.resolve();
    if (!settings.readOwn({ key: "autoReload", fallback: true }))
      return Promise.resolve();
    return saveCode({ id }).catch((error) =>
      console.error(`[extension] ${id}:`, error.message),
    );
  };
}

module.exports = { createOnCodeChanged };
