// messages.js
// Giao thức message main ↔ worker: kiểu message + chờ 1 message.

const MSG = Object.freeze({
  MANIFEST: "manifest", // worker → main: name + settings (mode inspect)
  READY: "ready", // worker → main: run() đã chạy xong phần đồng bộ
  ERROR: "error", // worker → main: lỗi
  CALL: "call", // worker → main: ext gọi command
  RESULT: "result", // main → worker: kết quả command
});

/** @param {{ worker: Worker, type: string, timeout: number }} args */
function waitFor({ worker, type, timeout }) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("Nạp ext quá thời gian")),
      timeout,
    );
    const settle = (fn, value) => {
      clearTimeout(timer);
      fn(value);
    };
    worker.on("message", (msg) => {
      if (msg.type === type) settle(resolve, msg);
      if (msg.type === MSG.ERROR) settle(reject, new Error(msg.message));
    });
    worker.once("error", (error) => settle(reject, error));
    worker.once("exit", () =>
      settle(reject, new Error("Worker dừng đột ngột")),
    );
  });
}

module.exports = { MSG, waitFor };
