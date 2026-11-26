// 2.logged.test.js
// Kiểm tra withLog: ghi đúng dòng, trả nguyên kết quả, lỗi vẫn ném tiếp.
// Chạy:  node --test modules/settings/test/2.logged.test.js

const test = require("node:test");
const assert = require("node:assert/strict");
const { withLog } = require("../backend/ai/logged");

function spy() {
  const lines = [];
  const log = { say: ({ task, message }) => lines.push(`${task}: ${message}`) };
  return { lines, log };
}

test("ghi action + id và trả nguyên kết quả", () => {
  const { lines, log } = spy();
  const run = withLog({ execute: (args) => ({ got: args.id }), log });
  assert.deepEqual(run({ action: "set", id: "appearance.theme" }), {
    got: "appearance.theme",
  });
  assert.deepEqual(lines, ["Execute: set appearance.theme"]);
});

test("không có id thì ghi query", () => {
  const { lines, log } = spy();
  withLog({ execute: () => null, log })({ action: "list", query: "theme" });
  assert.deepEqual(lines, ["Execute: list theme"]);
});

test("lỗi của execute vẫn ném tiếp", () => {
  const { log } = spy();
  const run = withLog({
    execute: () => {
      throw new Error("denied");
    },
    log,
  });
  assert.throws(() => run({ action: "set", id: "x" }), /denied/);
});
