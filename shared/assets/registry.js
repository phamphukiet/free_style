// Kho asset (ảnh, icon, url ngoài) do custom setting thêm — tách khỏi code,
// chỉ là dữ liệu tĩnh để .css/.template.js custom tham chiếu tới qua id.

const { app } = require("electron");
const path = require("path");
const fs = require("fs");

const ASSETS_DIR = path.join(app.getPath("userData"), "custom-assets");
const REGISTRY_FILE = path.join(ASSETS_DIR, "registry.json");

function ensureDir() {
  if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR, { recursive: true });
}
function readRegistry() {
  ensureDir();
  try {
    return JSON.parse(fs.readFileSync(REGISTRY_FILE, "utf-8"));
  } catch {
    return {};
  }
}
function writeRegistry(data) {
  ensureDir();
  fs.writeFileSync(REGISTRY_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// source: "https://..." | "data:image/png;base64,..." — không nhận đường dẫn file hệ thống tuỳ ý
function registerAsset(id, source) {
  const reg = readRegistry();
  reg[id] = source;
  writeRegistry(reg);
  return { id, source };
}
function getAsset(id) {
  return readRegistry()[id] || null;
}
function listAssets() {
  return readRegistry();
}

module.exports = { registerAsset, getAsset, listAssets };
