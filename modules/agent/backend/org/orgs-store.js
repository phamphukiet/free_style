// orgs-store.js
// CRUD thô cho org, lưu tại userData/orgs.json — không phụ thuộc project.

const { app } = require("electron");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const FILE = path.join(app.getPath("userData"), "orgs.json");

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

function list() {
  return Object.values(readAll()).sort((a, b) => b.updatedAt - a.updatedAt);
}

function get(id) {
  return readAll()[id] || null;
}

function save(org) {
  const data = readAll();
  const id = org.id || crypto.randomUUID();
  const now = Date.now();
  data[id] = {
    instances: [],
    ...data[id],
    ...org,
    id,
    updatedAt: now,
    createdAt: data[id]?.createdAt || now,
  };
  writeAll(data);
  return data[id];
}

function remove(id) {
  const data = readAll();
  delete data[id];
  writeAll(data);
  return true;
}

module.exports = { list, get, save, remove };
