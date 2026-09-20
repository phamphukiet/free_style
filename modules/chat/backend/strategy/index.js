// index.js
const { ipcMain } = require("electron");
const { registerCapability } = require("../../../shared/capability-registry");
const { readState, writeState } = require("../../../src/main/state");
const sessionStore = require("./session/store");
const { registerSessionIpc } = require("./session/ipc");
const { handleSend } = require("./send/handle-send");

function register() {
  // Module khác (kanban, dedupe_level...) lấy session qua registry, không require chéo.
  registerCapability({ id: "session", kind: "service", api: sessionStore });
  registerSessionIpc();

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
}

module.exports = { register };
