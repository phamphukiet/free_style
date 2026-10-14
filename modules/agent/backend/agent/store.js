// store.js
// CRUD agent trên shared/storage (namespace "agent"). Model: { id, name, providerId, keyId, model }.
// Tầng workspace (<project>/.vibe/agent.json) ghi đè tầng global (~/.vibe/agent.json).
// Nhận registry qua createAgentStore để test không cần Electron. Không đụng IPC.

const crypto = require("crypto");
const { registry: defaultRegistry } = require("../../../../shared/storage");

const MANAGER_ID = "manager";
const DEFAULT_MANAGER = Object.freeze({
  id: MANAGER_ID,
  name: "Manager",
  providerId: "",
  keyId: "",
  model: "",
});

/** @param {{ registry: { open: Function } }} deps */
function createAgentStore({ registry }) {
  let storage = null;
  const db = () => (storage ??= registry.open({ namespace: "agent" }));

  // Manager luôn tồn tại ở dạng ảo: chỉ ghi xuống đĩa khi người dùng thật sự lưu.
  function current({ id }) {
    const saved = db().get({ key: id, fallback: null });
    if (saved) return saved;
    return id === MANAGER_ID ? { ...DEFAULT_MANAGER } : null;
  }

  function list() {
    return Object.values({
      [MANAGER_ID]: { ...DEFAULT_MANAGER },
      ...db().entries(),
    });
  }

  const get = ({ id }) => current({ id });

  /** @param {{ agent: object }} args */
  function save({ agent }) {
    const id = agent.id || crypto.randomUUID();
    const prev = current({ id });
    const name = id === MANAGER_ID ? "Manager" : agent.name || prev?.name;
    const next = { ...prev, ...agent, id, name };
    db().set({ key: id, value: next });
    return next;
  }

  function remove({ id }) {
    if (id === MANAGER_ID || !db().has({ key: id })) return false;
    db().delete({ key: id }); // không truyền scope: xóa ở mọi tầng
    return true;
  }

  return { list, get, save, remove };
}

module.exports = {
  ...createAgentStore({ registry: defaultRegistry }),
  createAgentStore,
  MANAGER_ID,
};
