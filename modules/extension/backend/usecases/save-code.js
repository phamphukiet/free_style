// save-code.js — UC3: lưu code rồi tự nạp lại.
// `code` bỏ trống = file đã được ghi từ ngoài (Monaco) → chỉ đọc lại và nạp lại.
// Code không đổi so với lần nạp trước thì bỏ qua (tránh nạp đôi khi watcher bắt chính lần ghi này).

const { clearFailure } = require("../domain/extension");
const { needRecord } = require("./need-record");

/** @param {{ repo, codeStore, lifecycle, catalog, broadcast: Function }} deps */
function createSaveCode({ repo, codeStore, lifecycle, catalog, broadcast }) {
  async function reload({ id, record }) {
    if (record.enabled) await lifecycle.activate({ id });
    else await lifecycle.inspect({ id, record });
  }

  return async function saveCode({ id, code }) {
    const record = needRecord({ repo, id });
    const { language } = record;
    if (code !== undefined) await codeStore.write({ id, language, code });
    const current = code ?? (await codeStore.read({ id, language }));
    if (catalog.get({ id })?.code === current) return;

    const fresh = clearFailure({ record });
    repo.save({ id, record: fresh });
    try {
      await reload({ id, record: fresh });
    } finally {
      broadcast();
    }
  };
}

module.exports = { createSaveCode };
