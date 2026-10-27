const { ipcMain } = require("electron");
const channels = require("../../../../shared/core/ipc-channels");
const pty = require("../pty/pty-manager");

function forwardOutput(sender) {
  pty.onData((chunk) => {
    if (sender.isDestroyed()) return;
    try {
      sender.send(channels.TERMINAL_DATA, chunk);
    } catch {
      // webContents bị destroy giữa lúc check và lúc send
    }
  });
  pty.onExit(() => {
    if (!sender.isDestroyed()) sender.send(channels.TERMINAL_EXIT);
  });
}

function registerTerminalIpc() {
  ipcMain.handle(channels.TERMINAL_CREATE, (event, shellType, cwd) => {
    const result = pty.spawnShell(shellType, cwd);
    forwardOutput(event.sender);
    return result;
  });
  ipcMain.on(channels.TERMINAL_WRITE, (_e, data) => pty.writeShell(data));
  ipcMain.on(channels.TERMINAL_RESIZE, (_e, cols, rows) =>
    pty.resizeShell(cols, rows),
  );
  ipcMain.on(channels.TERMINAL_KILL, () => pty.killShell());
}

module.exports = { registerTerminalIpc };