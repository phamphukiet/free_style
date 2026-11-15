// js.js
// Trách nhiệm duy nhất: thông tin runtime JavaScript (file entry, worker, code mẫu).

const path = require("path");

const SAMPLE = `// Tự động lưu: cứ vài giây lại lưu các file đã sửa.

module.exports = {
  name: "Tự động lưu",

  settings: {
    enabled: { label: "Bật tự động lưu", default: false },
    seconds: { label: "Lưu sau mỗi (giây)", default: 5, options: [2, 5, 30] },
  },

  run({ settings, commands }) {
    if (!settings.enabled) return;

    setInterval(() => {
      commands.editor.saveAll();
    }, settings.seconds * 1000);
  },
};
`;

module.exports = {
  id: "js",
  label: "JavaScript",
  entry: "index.js",
  workerFile: path.join(__dirname, "worker.js"),
  sample: () => SAMPLE,
};
