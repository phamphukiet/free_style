// SHIM tương thích ngược: API cũ -> capability-registry (để module skill... chưa sửa vẫn chạy).
const { registerCapability } = require("./capability-registry");

const registerPromptContributor = (id, build, order = 100) =>
  registerCapability({ id, kind: "prompt", order, build });
const registerExecutorMiddleware = (id, wrap, order = 100) =>
  registerCapability({ id, kind: "exec-wrapper", order, wrap });
const registerSendWrapper = (id, wrap, order = 100) =>
  registerCapability({ id, kind: "send-wrapper", order, wrap });

module.exports = {
  registerPromptContributor,
  registerExecutorMiddleware,
  registerSendWrapper,
};
