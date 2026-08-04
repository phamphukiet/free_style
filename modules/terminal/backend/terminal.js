// terminal.js
// Trách nhiệm duy nhất: quản lý vòng đời pty process (spawn/write/resize/kill).
// Không biết gì về IPC channel — main/ipc.js gọi hàm ở đây rồi tự forward qua IPC.
// Không biết gì về path/args cụ thể của từng shell — hỏi platform/index.js.

const pty = require("node-pty");
const os = require("os");
const { getPlatform } = require("../platform");

// Chỉ giữ 1 instance duy nhất (đúng phạm vi bước này: 1 terminal, chưa multi-tab).
let ptyProcess = null;

/**
 * Spawn shell mới. Nếu đang có process cũ, kill trước để tránh leak.
 * Trả về { pid } cho renderer biết chắc đã sẵn sàng.
 */
function spawnShell(shellType, cwd) {
  killShell(); // đảm bảo không leak nếu đổi shell khi cái cũ còn sống

  const platform = getPlatform(shellType);
  const shellPath = platform.getShellPath();

  ptyProcess = pty.spawn(shellPath, platform.getArgs(), {
    name: "xterm-256color",
    cols: 80,
    rows: 24,
    cwd: cwd || os.homedir(),
    env: process.env,
  });

  return { pid: ptyProcess.pid };
}

/**
 * Đăng ký callback nhận output từ pty hiện tại.
 * Gọi lại mỗi lần spawn shell mới vì instance pty đổi.
 */
function onData(callback) {
  if (!ptyProcess) return;
  ptyProcess.onData(callback);
}

function writeShell(data) {
  ptyProcess?.write(data);
}

function resizeShell(cols, rows) {
  // pty.resize throw nếu cols/rows <= 0 (VD: panel đang thu về height 0)
  if (!ptyProcess || cols <= 0 || rows <= 0) return;
  ptyProcess.resize(cols, rows);
}

function killShell() {
  if (!ptyProcess) return;
  ptyProcess.kill();
  ptyProcess = null;
}

module.exports = { spawnShell, onData, writeShell, resizeShell, killShell };
