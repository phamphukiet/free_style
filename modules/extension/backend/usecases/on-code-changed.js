// on-code-changed.js — file code bị sửa từ ngoài (watcher): nạp lại, lỗi chỉ ghi log.
// Lỗi code của ext đã hiện ở dòng ext (catalog.error), không cần ném tiếp.

const { createLog } = require("../../../../shared/log");
const log = createLog({ filename: __filename });

function createOnCodeChanged({ repo, saveCode, settings }) {
  return function onCodeChanged({ id }) {
    if (!repo.get({ id })) return Promise.resolve();
    if (!settings.readOwn({ key: "autoReload", fallback: true }))
      return Promise.resolve();
    return log.say({
      task: "Reload",
      message: id,
      run: () => saveCode({ id }),
    });
  };
}

module.exports = { createOnCodeChanged };
