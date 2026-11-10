// remove-extension.js — UC5: xóa ext. Confirm do UI. Xóa luôn giá trị setting <id>.*

const { needRecord } = require("./need-record");

/** @param {{ repo, codeStore, lifecycle, settings, catalog, broadcast: Function }} deps */
function createRemoveExtension({
  repo,
  codeStore,
  lifecycle,
  settings,
  catalog,
  broadcast,
}) {
  return async function removeExtension({ id }) {
    needRecord({ repo, id });
    await lifecycle.deactivate({ id });
    settings.removeAll({ extId: id });
    await codeStore.remove({ id });
    repo.remove({ id });
    catalog.remove({ id });
    broadcast();
  };
}

module.exports = { createRemoveExtension };
