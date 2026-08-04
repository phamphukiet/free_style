// powershell.js
// Trách nhiệm duy nhất: cung cấp thông tin để spawn PowerShell.

function getShellPath() {
  return "powershell.exe";
}

function getArgs() {
  return [];
}

module.exports = {
  id: "powershell",
  label: "PowerShell",
  getShellPath,
  getArgs,
};
