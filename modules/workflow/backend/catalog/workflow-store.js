// workflow-store.js
// CRUD catalog workflow (metadata + steps) — lưu userData/workflow-catalog.json.
// Giống rules-store.js: content (steps) lưu thẳng trong JSON.

const { app } = require("electron");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const FILE = path.join(app.getPath("userData"), "workflow-catalog.json");

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
  return Object.values(readAll());
}

function get(id) {
  return readAll()[id] || null;
}

function upsert(workflow) {
  const data = readAll();
  const id = workflow.id || crypto.randomUUID();
  data[id] = {
    name: "Workflow mới",
    description: "",
    steps: [],
    pinned: false,
    ...data[id],
    ...workflow,
    id,
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

function togglePin(id) {
  const data = readAll();
  if (!data[id]) return null;
  data[id].pinned = !data[id].pinned;
  writeAll(data);
  return data[id];
}

function listPinned() {
  return list().filter((w) => w.pinned);
}

module.exports = { list, get, upsert, remove, togglePin, listPinned };
