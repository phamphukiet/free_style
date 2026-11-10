// worker.js
// Entry của worker_threads cho ext JavaScript.
// mode "inspect": chỉ nạp code, gửi lại name + settings. mode "run": nạp rồi gọi run().

const { parentPort, workerData } = require("worker_threads");
const vm = require("vm");
const { MSG } = require("../../worker/messages");
const { createSandbox, LOAD_TIMEOUT_MS } = require("../../worker/sandbox-api");

const { mode, code, settings } = workerData;
const post = (message) => parentPort.postMessage(message);

function plain(value) {
  const text = JSON.stringify(value);
  return text === undefined ? undefined : JSON.parse(text);
}

function fail(error) {
  post({ type: MSG.ERROR, message: error?.message || String(error) });
}

function load(sandbox) {
  const script = new vm.Script(code, { filename: "extension.js" });
  script.runInContext(sandbox.context, { timeout: LOAD_TIMEOUT_MS });
  const exported = sandbox.context.module.exports;
  return exported && typeof exported === "object" ? exported : {};
}

function runExtension({ exported, sandbox }) {
  if (typeof exported.run === "function") {
    sandbox.call(() =>
      exported.run({ settings: sandbox.settings, commands: sandbox.commands }),
    );
  }
  setInterval(() => {}, 2 ** 30); // giữ worker sống: ext bật = đang chạy, dù không có timer
  post({ type: MSG.READY });
}

function main() {
  const sandbox = createSandbox({ port: parentPort, settings });
  const exported = load(sandbox);
  if (mode === "inspect") {
    const name = typeof exported.name === "string" ? exported.name : undefined;
    return post({
      type: MSG.MANIFEST,
      name,
      settings: plain(exported.settings),
    });
  }
  runExtension({ exported, sandbox });
}

process.on("uncaughtException", fail);
process.on("unhandledRejection", fail);

try {
  main();
} catch (error) {
  fail(error);
}
