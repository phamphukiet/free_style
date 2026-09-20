const { ipcMain } = require("electron");
const store = require("./store");

const toMeta = ({ id, title, updatedAt }) => ({ id, title, updatedAt });
const toView = ({ toolCache, toolDirty, ...view }) => view;

function registerSessionIpc() {
  ipcMain.handle("chat:session-list", () => store.list().map(toMeta));
  ipcMain.handle("chat:session-get", (_, id) => {
    const session = store.get(id);
    return session && toView(session);
  });
  ipcMain.handle("chat:session-save", (_, s) => toMeta(store.save(s)));
  ipcMain.handle("chat:session-delete", (_, id) => store.remove(id));
}

module.exports = { registerSessionIpc };
