// state.js
// Trạng thái app (lastFolder, chatSelection...) — wrapper mỏng trên shared/storage,
// namespace "state" ở tầng global (~/.vibe/state.json). Registry theo dõi key
// lastFolder của namespace này để gắn tầng workspace cho mọi store.
// Giữ nguyên API readState/writeState để fs.js, chat... không phải sửa.

const { registry } = require("../../shared/storage");

const LEGACY = { file: "state.json", from: "userData" };

let state = null;
const db = () =>
  (state ??= registry.open({
    namespace: "state",
    scopes: ["global"],
    legacy: LEGACY, // nhập userData/state.json 1 lần, không mất project đang mở
  }));

function readState() {
  return db().entries();
}

function writeState(partial) {
  db().setMany({ entries: partial }); // giá trị null/undefined = xóa key
}

module.exports = { readState, writeState };