const { ipcMain } = require("electron");
const channels = require("../../../shared/ipc-channels");
const terminal = require("../../../modules/terminal/backend/terminal");

function registerTerminalIpc() {
  ipcMain.handle(channels.TERMINAL_CREATE, (event, shellType, cwd) => {
    const result = terminal.spawnShell(shellType, cwd);
    const sender = event.sender;
    terminal.onData((chunk) => {
      if (sender.isDestroyed()) return;
      try {
        sender.send(channels.TERMINAL_DATA, chunk);
      } catch (err) {
        // webContents có thể bị destroy giữa lúc check và lúc send
      }
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
