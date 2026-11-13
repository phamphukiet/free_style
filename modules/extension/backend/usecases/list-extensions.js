// list-extensions.js — UC1: danh sách ext (dữ liệu thô, presenter lo phần hiển thị).

function createListExtensions({ repo, codeStore, runner, catalog, settings }) {
  return function listExtensions() {
    return Object.entries(repo.all())
      .sort(([, a], [, b]) => a.createdAt - b.createdAt)
      .map(([id, record]) => {
        const info = catalog.get({ id });
        const definitions = info?.manifest?.settings ?? [];
        return {
          id,
          record,
          info,
          values: settings.read({ extId: id, definitions }),
          running: runner.isRunning({ id }),
          file: codeStore.fileOf({ id, language: record.language }),
        };
      });
  };
}

module.exports = { createListExtensions };
