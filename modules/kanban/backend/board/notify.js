// notify.js
// Trách nhiệm duy nhất: báo mọi renderer window biết board Kanban vừa đổi,
// để sidebar/editor tự reload theo thời gian thực, không cần polling.

const { BrowserWindow } = require("electron");

function broadcastKanbanChanged() {
  BrowserWindow.getAllWindows().forEach((win) => {
    try {
      win.webContents.send("kanban:changed");
    } catch {
      // window có thể đang bị destroy giữa lúc lặp
    }
  });
}

module.exports = { broadcastKanbanChanged };
