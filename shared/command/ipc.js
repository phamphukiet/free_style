// ipc.js
// Kênh bus: renderer báo handler (announce) và trả kết quả (respond).
// Viết ipcMain.handle trực tiếp vì shared/ipc/commands.js bỏ mất event (cần event.sender).

const { ipcMain } = require("electron");
const { CHANNEL } = require("./spec");

function registerCommandIpc({ bridge }) {
  ipcMain.handle(CHANNEL.announce, (event, ids) => {
    bridge.announce({ sender: event.sender, ids });
    return true;
  });
  ipcMain.handle(CHANNEL.respond, (event, payload) =>
    // senderId đặt SAU payload để renderer không ghi đè được.
    bridge.respond({ ...payload, senderId: event.sender.id }),
  );
}

module.exports = { registerCommandIpc };
