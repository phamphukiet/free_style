// sources/index.js
// Cổng DUY NHẤT tổng hợp mọi nguồn định nghĩa setting: prime, custom, download.
// Nơi khác (chat backend, settings IPC) chỉ được import file này —
// thêm/bớt nguồn không cần sửa code ở nơi dùng.

const prime = require("./prime");
// const custom = require("./custom");
// const download = require("./download");

const SOURCES = [prime /*, custom, download*/];

function initSources() {
  SOURCES.forEach((s) => s.init());
}
function getExtraActions() {
  return Object.assign({}, ...SOURCES.map((s) => s.getExtraActions()));
}
function getExtraHints() {
  return SOURCES.map((s) => s.getExtraHints()).join(" ");
}

module.exports = { initSources, getExtraActions, getExtraHints };
