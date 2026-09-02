const { app } = require("electron");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const FILE = path.join(app.getPath("userData"), "org-custom-presets.json");

function readAll() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return {};
  }
}
function writeAll(d) {
  fs.writeFileSync(FILE, JSON.stringify(d, null, 2), "utf-8");
}
function list() {
  return Object.values(readAll());
}
function get(id) {
  return readAll()[id] || null;
}
function save(name, roles) {
  const data = readAll();
  const id = "custom-" + crypto.randomUUID();
  data[id] = { id, name, roles, custom: true };
  writeAll(data);
  return data[id];
}
module.exports = { list, get, save };
