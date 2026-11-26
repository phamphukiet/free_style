// shared/command/each.js
// Chạy 1 việc cho từng đối tượng; lỗi 1 mục không làm hỏng cả lô. task có thể sync hoặc async.

/** @param {{ targets: string[], task: (key: string) => any }} args */
async function eachTarget({ targets, task }) {
  const items = [];
  for (const key of targets) {
    items.push(
      await Promise.resolve()
        .then(() => task(key))
        .then(
          () => ({ key, ok: true }),
          (error) => ({ key, ok: false, error: error.message }),
        ),
    );
  }
  return { items };
}

module.exports = { eachTarget };
