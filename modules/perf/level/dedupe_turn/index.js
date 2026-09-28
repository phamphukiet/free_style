const { wrap } = require("./wrap");
const {
  registerExecutorMiddleware,
} = require("../../../../shared/chat-pipeline-registry");

function register() {
  registerExecutorMiddleware("dedupe-turn", (fn) => wrap(fn), 10);
}

module.exports = { wrap, register };