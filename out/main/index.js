"use strict";
const { app, BrowserWindow } = require("electron");
const { createWindow } = require("./window");
const { buildAppMenu } = require("./menu");
const { registerWindowIpc } = require("./ipc");
function initApp() {
  createWindow();
}
app.whenReady().then(() => {
  buildAppMenu();
  registerWindowIpc();
  initApp();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      initApp();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
