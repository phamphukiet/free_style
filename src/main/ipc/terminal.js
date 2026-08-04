const { ipcMain } = require("electron");
const channels = require("../../../shared/ipc-channels");
const terminal = require("../../../modules/terminal/backend/terminal");

function registerTerminalIpc() {
  ipcMain.handle(channels.TERMINAL_CREATE, (event, shellType, cwd) => {
    const result = terminal.spawnShell(shellType, cwd);
    terminal.onData((chunk) => {
      event.sender.send(channels.TERMINAL_DATA, chunk);
    });
    return result;
  });

  ipcMain.on(channels.TERMINAL_WRITE, (event, data) => {
    terminal.writeShell(data);
  });

  ipcMain.on(channels.TERMINAL_RESIZE, (event, cols, rows) => {
    terminal.resizeShell(cols, rows);
  });

  ipcMain.on(channels.TERMINAL_KILL, () => {
    terminal.killShell();
  });
}

module.exports = { registerTerminalIpc };
