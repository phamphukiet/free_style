// skills-store.js
// CRUD catalog skill (metadata + gán agent) — lưu userData/skills-catalog.json.
// agentIds chỉ chứa id thô, KHÔNG JOIN cứng sang agents.json — xoá agent ở
// nơi khác không cần đụng file này, phía đọc tự lọc id không còn tồn tại.

const { app } = require("electron");
const path = require("path");
const fs = require("fs");

const FILE = path.join(app.getPath("userData"), "skills-catalog.json");

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

function upsert(skill) {
  const data = readAll();
  const id = skill.id || skill.sourceUrl; // sourceUrl làm id ổn định khi lần đầu từ platform trả về
  data[id] = {
    agentIds: [],
    rating: null,
    downloads: null,
    ...data[id],
    ...skill,
    id,
  };
  writeAll(data);
  return data[id];
}

function assignAgents(id, agentIds) {
  const data = readAll();
  if (!data[id]) return null;
  data[id].agentIds = agentIds;
  writeAll(data);
  return data[id];
}

function remove(id) {
  const data = readAll();
  delete data[id];
  writeAll(data);
  return true;
}

function listByAgent(agentId) {
  return list().filter((s) => (s.agentIds || []).includes(agentId));
}
function upsert(skill) {
  const data = readAll();
  const id = skill.id || skill.sourceUrl;
  data[id] = {
    agentIds: [],
    rating: null,
    downloads: null,
    pinned: false,
    ...data[id],
    ...skill,
    id,
  };
  writeAll(data);
  return data[id];
}

function togglePin(id) {
  const data = readAll();
  if (!data[id]) return null;
  data[id].pinned = !data[id].pinned;
  writeAll(data);
  return data[id];
}

function listPinned() {
  return list().filter((s) => s.pinned);
}

module.exports = {
  list,
  get,
  upsert,
  assignAgents,
  remove,
  listByAgent,
  togglePin,
  listPinned,
};