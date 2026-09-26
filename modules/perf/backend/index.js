// index.js
// Điểm đăng ký DUY NHẤT cho "perf" — main/ipc.js chỉ cần require + gọi register().
// Toàn bộ kết nối đi qua capability-registry / chat-pipeline-registry sẵn có —
// không require thẳng vào nội bộ modules/chat.

const {
  registerCapability,
  registerToolBridge,
} = require("../../../shared/capability-registry");
const {
  registerPromptContributor,
  registerExecutorMiddleware,
} = require("../../../shared/chat-pipeline-registry");
const config = require("./config");

function register() {
  if (config.dedupeTurn) {
    const dedupeTurn = require("../level/dedupe_turn");
    registerExecutorMiddleware("dedupe-turn", (fn) => dedupeTurn.wrap(fn), 10);
  }

  if (config.cacheCrossTurn) {
    const cacheCrossTurn = require("../level/cache_cross_turn");
    registerExecutorMiddleware(
      "cache-cross-turn",
      (fn, ctx) => cacheCrossTurn.wrap(fn, ctx.sessionId),
      20,
    );
  }

  if (config.todo) {
    const todo = require("../level/todo");
    registerToolBridge("todo", {
      getToolSpec: todo.getToolSpec,
      execute: (args, ctx) => todo.execute(args.action, args, ctx.sessionId),
    });
    registerPromptContributor(
      "todo",
      (ctx) => todo.renderTodoPrompt(ctx.sessionId),
      20,
    );
  }

  if (config.continuation) {
    // GHI CHÚ: continuation cần apiKey/model/buildOpts — những thứ tầng
    // exec-wrapper/send-wrapper hiện có (wrappers.js) không truyền vào wrap().
    // Vì vậy ở đây chỉ đăng ký guide-prompt + expose hàm resume dưới dạng
    // "service" để modules/chat/backend/send/run.js TỰ CHỌN gọi
    // continuation.runWithContinuation() nếu muốn — perf không tự ý
    // chèn vào pipeline gửi để tránh đoán sai hành vi.
    const continuation = require("../level/continuation");
    registerPromptContributor(
      "continuation-guide",
      () => continuation.buildContinuationGuide(),
      30,
    );
    registerCapability({
      id: "continuation",
      kind: "service",
      api: continuation,
    });
  }
}

module.exports = { register };