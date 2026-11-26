// 1.gate.test.js
// Kiểm tra: suy module từ đường dẫn, đóng băng, tiêu điểm, try/catch trong say, format, đọc VIBE_LOG.
// Chạy (ở thư mục gốc project):  node --test shared/log/test/1.gate.test.js

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const { createLog } = require("../index");
const { ROOT, whereOf } = require("../where");
const { focusOf } = require("../config");

const at = (...parts) => path.join(ROOT, ...parts);
const ACTIVE = ["chat", "settings"];
const SETTINGS_FILE = at("modules", "settings", "backend", "ai", "tool.js");
const CHAT_FILE = at("modules", "chat", "backend", "send", "run.js");
const EXT_FILE = at("modules", "extension", "backend", "index.js");

function capture({ filename, ...options }) {
  const lines = [];
  const sink = {
    say: (text) => lines.push(`say ${text}`),
    fail: (text) => lines.push(`fail ${text}`),
  };
  return { log: createLog({ filename, sink, ...options }), lines };
}

const open = { active: ACTIVE, focus: null };
const boom = () => {
  throw new Error("boom");
};

test("whereOf: module, owner, file từ đường dẫn", () => {
  assert.deepEqual(whereOf({ filename: SETTINGS_FILE }), {
    module: "settings",
    owner: "settings",
    file: "tool.js",
  });
  const shared = whereOf({ filename: at("shared", "command", "list.js") });
  assert.deepEqual([shared.module, shared.owner], ["shared", null]);
  const main = whereOf({ filename: at("src", "main", "ipc", "fs.js") });
  assert.deepEqual([main.module, main.owner], ["main", null]);
});

test("format đúng rule.md", () => {
  const { log, lines } = capture({ filename: SETTINGS_FILE, ...open });
  log.say({ task: "Resolve", message: "found 2 items" });
  assert.deepEqual(lines, [
    "say [Resolve - 'settings' - 'tool.js']: found 2 items",
  ]);
});

test("run thành công: trả đúng kết quả, không có dòng lỗi", () => {
  const { log, lines } = capture({ filename: SETTINGS_FILE, ...open });
  const value = log.say({ task: "Calc", run: () => 42 });
  assert.equal(value, 42);
  assert.deepEqual(lines, ["say [Calc - 'settings' - 'tool.js']: "]);
});

test("run ném lỗi đồng bộ: báo Error và trả fallback", () => {
  const { log, lines } = capture({ filename: SETTINGS_FILE, ...open });
  const value = log.say({ task: "Calc", run: boom, fallback: "safe" });
  assert.equal(value, "safe");
  assert.equal(lines[1], "fail [Error - 'settings' - 'tool.js']: boom");
});

test("run reject bất đồng bộ: báo Error và trả fallback", async () => {
  const { log, lines } = capture({ filename: SETTINGS_FILE, ...open });
  const value = await log.say({
    task: "Load",
    run: async () => boom(),
    fallback: [],
  });
  assert.deepEqual(value, []);
  assert.equal(lines[1], "fail [Error - 'settings' - 'tool.js']: boom");
});

test("module bị đóng băng: không log nhưng run vẫn chạy", () => {
  const { log, lines } = capture({ filename: EXT_FILE, ...open });
  const value = log.say({ task: "Boot", run: () => "ran" });
  log.say({ task: "Boot", run: boom });
  assert.equal(value, "ran");
  assert.deepEqual(lines, []);
});

test("tiêu điểm: ẩn topic lạ nhưng lỗi vẫn hiện; topic khai báo thì hiện", () => {
  const focus = ["command", "settings"];
  const chat = capture({ filename: CHAT_FILE, active: ACTIVE, focus });
  chat.log.say({ task: "Send", message: "hidden", run: boom });
  assert.deepEqual(chat.lines, ["fail [Error - 'chat' - 'run.js']: boom"]);

  const cmd = capture({
    filename: CHAT_FILE,
    topic: "command",
    active: ACTIVE,
    focus,
  });
  cmd.log.say({ task: "Match", message: "shown" });
  assert.deepEqual(cmd.lines, ["say [Match - 'chat' - 'run.js']: shown"]);
});

test("focusOf: profile, danh sách tự nhập, không đặt", () => {
  assert.deepEqual(focusOf({ env: { VIBE_LOG: "settingsPrompt" } }), [
    "command",
    "settings",
  ]);
  assert.deepEqual(focusOf({ env: { VIBE_LOG: "a, b" } }), ["a", "b"]);
  assert.equal(focusOf({ env: {} }), null);
});
