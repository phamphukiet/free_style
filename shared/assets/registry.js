// Kho asset (ảnh, icon, url ngoài) do custom setting thêm, lưu trên shared/storage.
// source: "https://..." | "data:image/png;base64,..." — không nhận đường dẫn file hệ thống tuỳ ý

const { registry } = require("../storage");

let storage = null;
const db = () =>
  (storage ??= registry.open({
    namespace: "assets",
    scopes: ["global"],
    legacy: { file: "custom-assets/registry.json", from: "userData" },
  }));

function registerAsset(id, source) {
  db().set({ key: id, value: source });
  return { id, source };
}

const getAsset = (id) => db().get({ key: id, fallback: null });
const listAssets = () => db().entries();

module.exports = { registerAsset, getAsset, listAssets };
