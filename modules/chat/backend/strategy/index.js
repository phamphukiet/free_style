// index.js
const { ipcMain } = require("electron");
const {
  registerCapability,
} = require("../../../../shared/core/capability-registry");
const { readState, writeState } = require("../../../../src/main/state");
const sessionStore = require("../session/store");
const { registerSessionIpc } = require("../session/ipc");
const { handleSend } = require("../send/handle-send");
const { modeMap } = require("../tool/modes");
const { askUser } = require("../tool/confirm");

function register() {
  registerCapability({ id: "session", kind: "service", api: sessionStore });
  registerSessionIpc();
  registerCapability({ id: "confirm", kind: "service", api: { ask: askUser } });
  ipcMain.handle("chat:send", (event, payload) => {
    const notify = (channel, info) => {
      try {
        event.sender.send(channel, info);
      } catch {
        /* window đã đóng */
      }
    };
    return handleSend(payload, notify);
  });

  ipcMain.handle("chat:save-selection", (_, selection) => {
    writeState({ chatSelection: selection });
    return true;
  });
  ipcMain.handle(
    "chat:load-selection",
    () => readState().chatSelection || null,
  );
  ipcMain.handle("chat:modes", () => modeMap());
}

module.exports = { register };
