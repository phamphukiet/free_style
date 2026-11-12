// handle-crash.js — UC10: ext lỗi giữa chừng → tính crash, chạy lại; chạm ngưỡng thì tự tắt.
// Đệ quy có giới hạn: mỗi lần lỗi tăng crashes, tới ngưỡng thì enabled=false và dừng.

const { applyCrash, MAX_CRASHES } = require("../domain/crash-policy");

function createHandleCrash({ repo, lifecycle, settings, broadcast }) {
  return async function handleCrash({ id, message }) {
    const record = repo.get({ id });
    if (!record?.enabled) return;

    const max = settings.readOwn({ key: "maxCrashes", fallback: MAX_CRASHES });
    const { record: next, disabled } = applyCrash({ record, message, max });
    repo.save({ id, record: next });
    try {
      if (disabled) await lifecycle.deactivate({ id });
      else await lifecycle.restart({ id });
    } catch (error) {
      await handleCrash({ id, message: error.message });
    } finally {
      broadcast();
    }
  };
}

module.exports = { createHandleCrash };
