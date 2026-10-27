const pty = require("node-pty");
const os = require("os");
const { getPlatform } = require("../platform");

let ptyProcess = null;

function spawnShell(shellType, cwd) {
  killShell();
  const platform = getPlatform(shellType);
  ptyProcess = pty.spawn(platform.getShellPath(), platform.getArgs(), {
    name: "xterm-256color",
    cols: 80,
    rows: 24,
    cwd: cwd || os.homedir(),
    env: process.env,
  });
  return { pid: ptyProcess.pid };
}

function onData(callback) {
  ptyProcess?.onData(callback);
}

function onExit(callback) {
  const current = ptyProcess;
  current?.onExit((event) => {
    if (ptyProcess !== current) return;
    ptyProcess = null;
    callback(event);
  });
}

function writeShell(data) {
  ptyProcess?.write(data);
}

function resizeShell(cols, rows) {
  if (!ptyProcess || cols <= 0 || rows <= 0) return;
  ptyProcess.resize(cols, rows);
}

function killShell() {
  if (!ptyProcess) return;
  ptyProcess.kill();
  ptyProcess = null;
}

module.exports = {
  spawnShell,
  onData,
  onExit,
  writeShell,
  resizeShell,
  killShell,
};