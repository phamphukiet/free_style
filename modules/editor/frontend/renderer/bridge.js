// bridge.js
// Cầu nối thực tế cho editor frontend gọi API đọc/ghi file từ backend.

async function readFile(path) {
  return window.api.fs.readFile(path);
}

async function writeFile(path, content) {
  return window.api.fs.writeFile(path, content);
}

export { readFile, writeFile };
