// electron-mock.js
// Giả lập tối thiểu module "electron" để code backend (app.getPath, safeStorage,
// ipcMain...) chạy được dưới `node` thường, không cần mở app Electron thật.
// Dữ liệu ghi vào thư mục tạm riêng của test, không đụng userData thật.

const os = require("os");
const path = require("path");
const fs = require("fs");

const FAKE_USERDATA = path.join(os.tmpdir(), "agents-test-userdata");
fs.mkdirSync(FAKE_USERDATA, { recursive: true });

const app = {
  getPath: (name) => (name === "userData" ? FAKE_USERDATA : os.tmpdir()),
};

const safeStorage = {
  isEncryptionAvailable: () => false, // ép dùng nhánh plaintext, không cần OS keychain
  encryptString: (text) => Buffer.from(text, "utf-8"),
  decryptString: (buf) => buf.toString("utf-8"),
};

const ipcMain = {
  handle: () => {},
  on: () => {},
};

const BrowserWindow = {
  fromWebContents: () => null,
};

const shell = { openExternal: () => {} };
const dialog = {
  showOpenDialog: async () => ({ canceled: true, filePaths: [] }),
};

module.exports = { app, safeStorage, ipcMain, BrowserWindow, shell, dialog };