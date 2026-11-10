// handle-crash.js — UC10: ext lỗi giữa chừng → tính crash, chạy lại; chạm ngưỡng thì tự tắt.
// Đệ quy có giới hạn: mỗi lần lỗi tăng crashes, tới ngưỡng thì enabled=false và dừng.

const { applyCrash } = require("../domain/crash-policy");

/** @param {{ repo, lifecycle, broadcast: Function }} deps */
function createHandleCrash({ repo, lifecycle, broadcast }) {
  return async function handleCrash({ id, message }) {
    const record = repo.get({ id });
    if (!record?.enabled) return;

    const { record: next, disabled } = applyCrash({ record, message });
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
