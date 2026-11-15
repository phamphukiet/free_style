// sync-extensions.js — đồng bộ thư mục ↔ record lúc khởi động, rồi nạp/chạy từng ext.
// Thư mục chưa có record → tạo record Tắt. Record mất thư mục → xóa record.

const { buildRecord } = require("../domain/extension");

const ignore = () => {}; // lỗi nạp đã nằm trong catalog, hiện ở dòng ext

function adoptNew({ repo, codeStore, ids }) {
  const known = repo.all();
  ids
    .filter((id) => !Object.hasOwn(known, id))
    .forEach((id) =>
      repo.save({
        id,
        record: buildRecord({ language: codeStore.detectLanguage({ id }) }),
      }),
    );
}

function dropMissing({ repo, ids }) {
  Object.keys(repo.all())
    .filter((id) => !ids.includes(id))
    .forEach((id) => repo.remove({ id }));
}

/** @param {{ repo, codeStore, lifecycle, broadcast: Function }} deps */
function createSyncExtensions({ repo, codeStore, lifecycle, broadcast }) {
  return async function syncExtensions() {
    const ids = codeStore.listIds();
    adoptNew({ repo, codeStore, ids });
    dropMissing({ repo, ids });
    for (const [id, record] of Object.entries(repo.all())) {
      const load = record.enabled ? lifecycle.activate : lifecycle.inspect;
      await load({ id, record }).catch(ignore);
    }
    broadcast();
  };
}

module.exports = { createSyncExtensions };
