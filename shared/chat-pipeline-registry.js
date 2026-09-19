// chat-pipeline-registry.js
// Registry TỔNG QUÁT để module ngoài (rule, skill, dedupe_level...) tự góp
// phần vào luồng gửi chat — chat/backend KHÔNG cần biết chúng tồn tại.
// Thêm/xóa 1 module đóng góp -> module tự đăng ký/không đăng ký trong chính
// backend/index.js của nó, KHÔNG sửa file này hay bất kỳ file nào trong chat/.

const promptContributors = []; // [{ key, fn, order }]
const executorMiddlewares = []; // [{ key, wrap, order }]
const sendWrappers = []; // [{ key, wrap, order }]

function bySort(a, b) {
  return a.order - b.order;
}

function registerPromptContributor(key, fn, order = 100) {
  promptContributors.push({ key, fn, order });
}
function getPromptContributors() {
  return [...promptContributors].sort(bySort);
}

function registerExecutorMiddleware(key, wrap, order = 100) {
  executorMiddlewares.push({ key, wrap, order });
}
function getExecutorMiddlewares() {
  return [...executorMiddlewares].sort(bySort);
}

function registerSendWrapper(key, wrap, order = 100) {
  sendWrappers.push({ key, wrap, order });
}
function getSendWrappers() {
  return [...sendWrappers].sort(bySort);
}

module.exports = {
  registerPromptContributor,
  getPromptContributors,
  registerExecutorMiddleware,
  getExecutorMiddlewares,
  registerSendWrapper,
  getSendWrappers,
};
