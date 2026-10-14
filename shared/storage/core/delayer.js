// delayer.js
// Gom nhiều lần trigger trong `delay` ms thành 1 lần chạy task cuối cùng.

/** @typedef {{ delay?: number }} DelayerOptions */
function createDelayer({ delay: defaultDelay = 100 } = {}) {
  let timer = null;
  let task = null;
  let waiters = [];

  async function run() {
    timer = null;
    const current = task;
    const batch = waiters;
    task = null;
    waiters = [];
    try {
      await current();
      batch.forEach((w) => w.resolve());
    } catch (error) {
      batch.forEach((w) => w.reject(error));
    }
  }

  /** @param {{ task: () => Promise<void>, delay?: number }} args */
  function trigger({ task: next, delay = defaultDelay }) {
    task = next;
    return new Promise((resolve, reject) => {
      waiters.push({ resolve, reject });
      clearTimeout(timer);
      timer = setTimeout(run, delay);
    });
  }

  // Huỷ hẹn và giải phóng người chờ (caller tự chịu trách nhiệm ghi ngay).
  function cancel() {
    clearTimeout(timer);
    timer = null;
    const batch = waiters;
    task = null;
    waiters = [];
    batch.forEach((w) => w.resolve());
  }

  return { trigger, cancel, isPending: () => timer !== null };
}

module.exports = { createDelayer };
