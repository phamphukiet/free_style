// code-watcher.js
// Theo dõi file code ext bị sửa từ ngoài (VD Monaco ghi qua fs:write-file).
// Gom nhiễu 200ms cho mỗi ext. Phần `watch` của port code-store.

const fs = require("fs");
const { isValidId } = require("../../domain/ext-id");

const DEBOUNCE_MS = 200;
const NOOP = { dispose() {} };

/** @param {{ rootDir: string, entries: string[] }} deps  entries = tên file entry của các runtime */
function createCodeWatcher({ rootDir, entries }) {
  return {
    watch({ listener }) {
      const timers = new Map();
      const onFile = (_event, filename) => {
        const [id, file] = String(filename ?? "").split(/[\\/]/);
        if (!isValidId(id) || !entries.includes(file)) return;
        clearTimeout(timers.get(id));
        timers.set(
          id,
          setTimeout(() => {
            timers.delete(id);
            listener({ id });
          }, DEBOUNCE_MS),
        );
      };
      try {
        fs.mkdirSync(rootDir, { recursive: true });
        const watcher = fs.watch(rootDir, { recursive: true }, onFile);
        return {
          dispose() {
            watcher.close();
            timers.forEach((timer) => clearTimeout(timer));
          },
        };
      } catch (error) {
        console.warn(
          "[extension] không theo dõi được thư mục code:",
          error.message,
        );
        return NOOP;
      }
    },
  };
}

module.exports = { createCodeWatcher };
