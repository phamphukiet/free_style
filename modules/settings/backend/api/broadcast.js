// broadcast.js
// Engine đổi → báo mọi window: "settings:changed" ({id,value}, tương thích code cũ)
// và "settings:effects" (batch effect đã resolve cho shared/setting/effect.js).

const { BrowserWindow } = require("electron");

function send({ channel, payload }) {
  BrowserWindow.getAllWindows().forEach((win) => {
    if (!win.isDestroyed()) win.webContents.send(channel, payload);
  });
}

function bindBroadcast({ engine }) {
  return engine.onDidChange({
    listener: ({ ids }) => {
      ids.forEach((id) => {
        const value = engine.inspect({ id }).value;
        send({ channel: "settings:changed", payload: { id, value } });
      });
      const effects = ids.flatMap((id) => engine.effectsFor({ id }));
      if (effects.length > 0)
        send({ channel: "settings:effects", payload: effects });
    },
  });
}

module.exports = { bindBroadcast };
