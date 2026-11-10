// ipc.js
// Nối kênh "extension:*" với usecase. Bọc { ok, data } / { ok:false, error } qua shared/ipc/commands.

const { registerCommands } = require("../../../../shared/ipc/commands");

/** @param {{ usecases: object, presenter: object }} deps */
function registerExtensionIpc({ usecases, presenter }) {
  registerCommands({
    prefix: "extension",
    commands: {
      list: () => usecases.list().map(presenter.extension),
      languages: () => usecases.languages(),
      commands: () => usecases.commands().map(presenter.command),
      create: (payload) => usecases.create(payload),
      save: (payload) => usecases.save(payload),
      setEnabled: (payload) => usecases.setEnabled(payload),
      remove: (payload) => usecases.remove(payload),
    },
  });
}

module.exports = { registerExtensionIpc };
