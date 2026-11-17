// index.js
const { ipcMain } = require("electron");
const {
  registerCapability,
} = require("../../../../shared/core/capability-registry");
const { readState, writeState } = require("../../../../src/main/state");
const sessionStore = require("../session/store");
const { registerSessionIpc } = require("../session/ipc");
const { handleSend } = require("../send/handle-send");

function register() {
  registerCapability({ id: "session", kind: "service", api: sessionStore });
  registerSessionIpc();
  require("../tool").register();

  ipcMain.handle("chat:send", (event, payload) => {
    const notify = (channel, info) => {
      try {
        event.sender.send(channel, info);
      } catch {
        /* window đã đóng */
      }
    };
    return handleSend({ ...payload, windowId: event.sender.id }, notify);
  });

  ipcMain.handle("chat:save-selection", (_, selection) => {
    writeState({ chatSelection: selection });
    return true;
  });
  ipcMain.handle(
    "chat:load-selection",
    () => readState().chatSelection || null,
  );
}

module.exports = { register };
