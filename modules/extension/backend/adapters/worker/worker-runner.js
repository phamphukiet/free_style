// worker-runner.js
// Cài đặt port runner bằng worker_threads. 1 ext = 1 worker.
// Crash (lỗi, thoát bất ngờ, hết bộ nhớ) báo qua onCrash; stop/restart chủ động thì không báo.

const { Worker } = require("worker_threads");
const { MSG, waitFor } = require("./messages");

const READY_TIMEOUT_MS = 3000;
const MEMORY_LIMIT_MB = 64;

/** @param {{ getRuntime: Function, commandBus: object }} deps */
function createWorkerRunner({ getRuntime, commandBus }) {
  const running = new Map(); // id -> Worker
  const crashListeners = new Set();

  function spawn({ language, data }) {
    const { workerFile } = getRuntime({ language });
    return new Worker(workerFile, {
      workerData: data,
      resourceLimits: { maxOldGenerationSizeMb: MEMORY_LIMIT_MB },
    });
  }

  // Ext gọi command → main kiểm tra + chạy → trả kết quả về worker.
  function serveCommands({ worker }) {
    worker.on("message", async (msg) => {
      if (msg.type !== MSG.CALL) return;
      const { module: moduleId, name, args, callId } = msg;
      const reply = await commandBus.run({ module: moduleId, name, args }).then(
        (data) => ({ ok: true, data }),
        (error) => ({ ok: false, error: error.message }),
      );
      worker.postMessage({ type: MSG.RESULT, callId, ...reply });
    });
  }

  function watchCrash({ id, worker }) {
    const fail = (message) => {
      if (running.get(id) !== worker) return; // đã stop/thay thế chủ động
      running.delete(id);
      worker.terminate();
      crashListeners.forEach((listener) => listener({ id, message }));
    };
    worker.on("message", (msg) => msg.type === MSG.ERROR && fail(msg.message));
    worker.on("error", (error) => fail(error.message));
    worker.on("exit", () => fail("Ext dừng đột ngột"));
  }

  async function inspect({ language, code }) {
    const worker = spawn({ language, data: { mode: "inspect", code } });
    try {
      const { name, settings } = await waitFor({
        worker,
        type: MSG.MANIFEST,
        timeout: READY_TIMEOUT_MS,
      });
      return { name, settings };
    } finally {
      await worker.terminate();
    }
  }

  async function stop({ id }) {
    const worker = running.get(id);
    running.delete(id);
    await worker?.terminate();
  }

  async function start({ id, language, code, settings }) {
    await stop({ id });
    const worker = spawn({ language, data: { mode: "run", code, settings } });
    running.set(id, worker);
    serveCommands({ worker });
    try {
      await waitFor({ worker, type: MSG.READY, timeout: READY_TIMEOUT_MS });
    } catch (error) {
      if (running.get(id) === worker) running.delete(id);
      await worker.terminate();
      throw error;
    }
    watchCrash({ id, worker });
  }

  return {
    inspect,
    start,
    stop,
    stopAll: () => Promise.all([...running.keys()].map((id) => stop({ id }))),
    isRunning: ({ id }) => running.has(id),
    onCrash: ({ listener }) => {
      crashListeners.add(listener);
      return { dispose: () => crashListeners.delete(listener) };
    },
  };
}

module.exports = { createWorkerRunner };
