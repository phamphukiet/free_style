// list-extensions.js — UC1: danh sách ext (dữ liệu thô, presenter lo phần hiển thị).

function createListExtensions({ repo, codeStore, runner, catalog }) {
  return function listExtensions() {
    return Object.entries(repo.all())
      .sort(([, a], [, b]) => a.createdAt - b.createdAt)
      .map(([id, record]) => ({
        id,
        record,
        info: catalog.get({ id }),
        running: runner.isRunning({ id }),
        file: codeStore.fileOf({ id, language: record.language }),
      }));
  };
}

module.exports = { createListExtensions };
