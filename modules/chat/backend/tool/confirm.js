// confirm.js: hộp thoại xác nhận do USER bấm, ở main process. Model không tự xác nhận được.
const { dialog, BrowserWindow } = require("electron");

/** @param {{ message: string, detail?: string }} args */
async function askUser({ message, detail = "" }) {
  const options = {
    type: "warning",
    buttons: ["Huỷ", "Đồng ý"],
    defaultId: 0,
    cancelId: 0,
    message,
    detail,
  };
  const win = BrowserWindow.getFocusedWindow();
  const { response } = win
    ? await dialog.showMessageBox(win, options)
    : await dialog.showMessageBox(options);
  return response === 1;
}

module.exports = { askUser };
