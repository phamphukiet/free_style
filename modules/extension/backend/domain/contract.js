// contract.js
// Hợp đồng viết ext, gắn vào lệnh extension.create (field guide) để đưa cho agent. Chỉ là dữ liệu.
// Không đặt trong setting/command/ vì scan.js sẽ đọc file ở đó như file lệnh.

const CONTRACT = [
  "An extension is one JavaScript file assigned to module.exports:",
  '{ name: "Name", settings: { key: { label, default, options? } }, run({ settings, commands }) { ... } }',
  "- settings (optional) show in Settings and are read via settings.key. default is true/false, a number or a string.",
  "- run() runs when the extension is enabled, and again on every app start or setting change.",
  "- Only console, setTimeout, setInterval (>= 100ms) and commands.<module>.<command>(args) exist. No require, fs, DOM or fetch.",
  "- commands.* return Promises. Always end with .catch(() => {}) so a failure is not counted as a crash. A command returns { cancelled: true } when the user cancels.",
  "- Each synchronous part may run at most 1 second; use Promises for long work.",
  '- Call only commands from the list "Commands an extension may call".',
  "- App CSS variables, set via commands.settings.setCssVars({ vars }): --bg-image (url(...)), --bg-primary, --bg-secondary, --sidebar-bg, --panel-bg, --titlebar-bg, --statusbar-bg, --activitybar-bg. Use rgba(...) colors to let the image show; the editor area stays opaque.",
  "Example (pick an image from the computer as background):",
  'module.exports = { name: "Background image", run({ commands }) { commands.files.pickImage({ key: "bg", reuse: true }).then((r) => r && !r.cancelled && commands.settings.setCssVars({ vars: { "--bg-image": `url(${r.url})` } })).catch(() => {}); } };',
].join("\n");

module.exports = { CONTRACT };
