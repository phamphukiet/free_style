// store.js
// CRUD session chat trên shared/storage (namespace "chat-sessions", tầng global).
// Session: { id, title, agentId, messages, tokenUsed, lastToolUsed, updatedAt }

const crypto = require("crypto");
const { registry } = require("../../../../shared/storage");

let storage = null;
const db = () =>
  (storage ??= registry.open({
    namespace: "chat-sessions",
    scopes: ["global", "workspace"], // muốn session theo project: đổi thành ["global", "workspace"]
    legacy: { file: "chat-sessions.json", from: "userData" },
  }));

function list() {
  return Object.values(db().entries()).sort(
    (a, b) => (b.updatedAt || 0) - (a.updatedAt || 0),
  );
}

function get(id) {
  return db().get({ key: id, fallback: null });
}

function save(session) {
  const id = session.id || crypto.randomUUID();
  const next = {
    messages: [],
    tokenUsed: 0,
    ...get(id),
    ...session,
    id,
    updatedAt: Date.now(),
  };
  db().set({ key: id, value: next });
  return next;
}

function remove(id) {
  if (!db().has({ key: id })) return false;
  db().delete({ key: id });
  return true;
}

function update(id, mutate) {
  const session = get(id);
  if (!session) return null;
  mutate(session);
  db().set({ key: id, value: session });
  return session;
}

function appendMessage(id, message, tokenUsed = 0) {
  return update(id, (s) => {
    s.messages = [...(s.messages || []), message];
    s.tokenUsed = (s.tokenUsed || 0) + tokenUsed;
    s.updatedAt = Date.now();
  });
}

function setLastTool(id, toolId) {
  return update(id, (s) => {
    s.lastToolUsed = toolId;
  });
}

module.exports = { list, get, save, remove, appendMessage, setLastTool };