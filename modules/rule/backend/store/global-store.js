// global-store.js
// Rule GLOBAL: userData/rules-global.json, làm mẫu cho mọi project.
// Chỉ { id, name, content } — agent/bật-tắt là dữ liệu theo project, không ở đây.

const { app } = require("electron");
const path = require("path");
const fs = require("fs");

const FILE = path.join(app.getPath("userData"), "rules-global.json");

function readAll() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return {};
  }
}

function writeAll(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf-8");
}

const list = () => Object.values(readAll());
const get = (id) => readAll()[id] || null;

function upsert({ id, name, content }) {
  const data = readAll();
  data[id] = { id, name, content };
  writeAll(data);
  return data[id];
}

function remove(id) {
  const data = readAll();
  delete data[id];
  writeAll(data);
  return true;
}

module.exports = { list, get, upsert, remove };