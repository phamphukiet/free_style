// cmd.js
// Trách nhiệm duy nhất: cung cấp thông tin để spawn Command Prompt.
// Không đụng tới node-pty hay IPC — các việc đó thuộc backend/terminal.js.

function getShellPath() {
  // ComSpec luôn trỏ đúng cmd.exe theo hệ thống, tránh hardcode path
  return process.env.ComSpec || "C:\\Windows\\System32\\cmd.exe";
}

function getArgs() {
  return [];
}

module.exports = {
  id: "cmd",
  label: "Command Prompt",
  getShellPath,
  getArgs,
};
