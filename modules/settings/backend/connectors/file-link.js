// file-link.js
// Liên kết 1 file JSON ngoài (đường dẫn tuyệt đối, đuôi .json), 2 chiều:
//   file đổi → engine.set từng key hợp lệ; engine đổi → ghi lại các giá trị global.
// File thuộc quyền app: key lạ bị ghi đè khi đẩy; xoá key trong file KHÔNG reset giá trị.
// `lastText` chặn vòng lặp ghi ↔ đọc.

const fs = require("fs");
const path = require("path");

const DEBOUNCE_MS = 150;

function createFileLink({ engine, store }) {
  const state = {
    file: null,
    watcher: null,
    unsub: null,
    timer: null,
    lastText: "",
  };

  const safe = (fn) => {
    try {
      fn();
    } catch (error) {
      console.warn("[settings:file-link]", error.message);
    }
  };

  function pull() {
    const text = fs.readFileSync(state.file, "utf-8");
    if (text === state.lastText) return;
    state.lastText = text;
    Object.entries(JSON.parse(text)).forEach(([id, value]) =>
      safe(() => engine.set({ id, value, scope: "global" })),
    );
  }

  function push() {
    const entries = engine
      .list()
      .filter((item) => item.global !== undefined)
      .map((item) => [item.def.id, item.global]);
    const text = `${JSON.stringify(Object.fromEntries(entries), null, 2)}\n`;
    if (text === state.lastText) return;
    state.lastText = text;
    fs.writeFileSync(state.file, text, "utf-8");
  }

  function schedulePull() {
    clearTimeout(state.timer);
    state.timer = setTimeout(() => safe(pull), DEBOUNCE_MS);
  }

  function stop() {
    clearTimeout(state.timer);
    state.watcher?.close();
    state.unsub?.dispose();
    Object.assign(state, { file: null, watcher: null, unsub: null });
  }

  function start({ file }) {
    stop();
    state.file = file;
    if (fs.existsSync(file)) safe(pull);
    safe(push);
    state.watcher = fs.watch(file, schedulePull);
    state.watcher.on("error", stop);
    state.unsub = engine.onDidChange({ listener: () => safe(push) });
  }

  return {
    link({ file }) {
      const valid =
        path.isAbsolute(file) && path.extname(file).toLowerCase() === ".json";
      if (!valid)
        throw new Error("Chỉ liên kết file .json với đường dẫn tuyệt đối.");
      store.set({ key: "file", value: file });
      start({ file });
      return { file };
    },
    unlink() {
      stop();
      store.delete({ key: "file" });
      return { file: null };
    },
    status: () => ({ file: state.file }),
    restore() {
      const file = store.get({ key: "file", fallback: null });
      if (file) safe(() => start({ file }));
    },
  };
}

module.exports = { createFileLink };
