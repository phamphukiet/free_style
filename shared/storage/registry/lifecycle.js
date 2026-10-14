// Gắn handler vào sự kiện thoát app; ngoài Electron (test) thì bỏ qua.

/** @param {{ handler: () => void }} args */
function onAppQuit({ handler }) {
  try {
    require("electron").app.on("before-quit", handler);
  } catch {
    /* ngoài Electron */
  }
}

module.exports = { onAppQuit };
