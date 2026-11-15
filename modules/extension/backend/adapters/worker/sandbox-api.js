// sandbox-api.js
// Đồ nghề duy nhất ext được dùng: module, console, timer bọc lại, commands.
// Ext chạy trong vm context nên không có require/process/fs. vm + worker chặn treo/crash,
// KHÔNG phải ranh giới bảo mật tuyệt đối (ext do chính user viết); lớp chặn lệnh là command-bus.

const vm = require("vm");
const { MSG } = require("./messages");

const LOAD_TIMEOUT_MS = 1000;
const CALL_TIMEOUT_MS = 1000;
const MIN_INTERVAL_MS = 100;

// Gọi command qua main, trả Promise theo callId.
function createCaller({ port }) {
  const pending = new Map();
  let seq = 0;

  port.on("message", (msg) => {
    if (msg.type !== MSG.RESULT) return;
    const entry = pending.get(msg.callId);
    pending.delete(msg.callId);
    if (!entry) return;
    if (msg.ok) entry.resolve(msg.data);
    else entry.reject(new Error(msg.error));
  });

  return ({ moduleId, name, args }) =>
    new Promise((resolve, reject) => {
      const callId = ++seq;
      pending.set(callId, { resolve, reject });
      port.postMessage({
        type: MSG.CALL,
        callId,
        module: moduleId,
        name,
        args,
      });
    });
}

// commands.<module>.<lệnh>(args): tên được kiểm tra ở main (command-bus), lệnh lạ bị từ chối.
function createCommands({ call }) {
  const forModule = (moduleId) =>
    new Proxy(
      {},
      {
        get: (_target, name) =>
          typeof name === "string"
            ? (args) => call({ moduleId, name, args })
            : undefined,
      },
    );
  return new Proxy(
    {},
    {
      get: (_target, id) =>
        typeof id === "string" ? forModule(id) : undefined,
    },
  );
}

// Timer bọc lại: mỗi lần chạy callback có timeout; terminate worker là hủy hết timer.
function createTimers({ run }) {
  const wrap = (fn) => {
    if (typeof fn !== "function") throw new TypeError("Timer cần một hàm");
    return () => run(fn);
  };
  return {
    setTimeout: (fn, ms) => setTimeout(wrap(fn), ms),
    setInterval: (fn, ms) =>
      setInterval(wrap(fn), Math.max(Number(ms) || 0, MIN_INTERVAL_MS)),
    clearTimeout: (handle) => clearTimeout(handle),
    clearInterval: (handle) => clearInterval(handle),
  };
}

/** @param {{ port: MessagePort, settings?: object }} args */
function createSandbox({ port, settings }) {
  const context = vm.createContext({
    module: { exports: {} },
    console: { log: console.log, warn: console.warn, error: console.error },
  });
  const call = (fn) => {
    context.__fn = fn;
    return vm.runInContext("__fn()", context, { timeout: CALL_TIMEOUT_MS });
  };
  Object.assign(context, createTimers({ run: call }));
  return {
    context,
    call,
    settings: Object.freeze({ ...settings }),
    commands: createCommands({ call: createCaller({ port }) }),
  };
}

module.exports = { createSandbox, LOAD_TIMEOUT_MS };
