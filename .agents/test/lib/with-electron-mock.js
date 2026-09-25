// with-electron-mock.js
// Trách nhiệm duy nhất: tráo require("electron") -> electron-mock.js trong lúc
// chạy 1 đoạn code, rồi trả lại như cũ. Không sửa bất kỳ file production nào.

const Module = require("module");
const path = require("path");

const MOCK_PATH = path.resolve(__dirname, "electron-mock.js");
const originalLoad = Module._load;

function installElectronMock() {
  Module._load = function (request, parent, isMain) {
    if (request === "electron") {
      return originalLoad.call(this, MOCK_PATH, parent, isMain);
    }
    return originalLoad.apply(this, arguments);
  };
}

function uninstallElectronMock() {
  Module._load = originalLoad;
}

// Chạy fn() với mock được bật, tự tắt lại kể cả khi fn() throw.
async function withElectronMock(fn) {
  installElectronMock();
  try {
    return await fn();
  } finally {
    uninstallElectronMock();
  }
}

module.exports = { withElectronMock };
