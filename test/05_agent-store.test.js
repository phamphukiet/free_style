// 05_agent-store.test.js — agent/store trên shared/storage: manager ảo, ghim, xóa.
const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { createRegistry } = require("../shared/storage");
const { createAgentStore } = require("../modules/agent/backend/agent/store");

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "agent-"));
const cases = [];
const test = (name, fn) => cases.push({ name, fn });

function fresh() {
  const registry = createRegistry({ globalDir: tmp(), followState: false });
  return { registry, store: createAgentStore({ registry }) };
}
const layer = ({ registry }) => registry.find({ namespace: "agent" }).store;

test("manager ảo: đứng đầu list, không bị ghi ngầm xuống đĩa", () => {
  const { registry, store } = fresh();
  const proj = tmp();
  registry.setWorkspace({ folder: proj });
  assert.strictEqual(store.list()[0].id, "manager");
  const dev = store.save({ agent: { name: "Dev" } });
  layer({ registry }).flushSync();
  const file = path.join(proj, ".vibe", "agent.json");
  const saved = JSON.parse(fs.readFileSync(file, "utf-8"));
  assert.deepStrictEqual(Object.keys(saved), [dev.id]);
});

test("lưu manager: đè bản mặc định, tên luôn là Manager, không nhân đôi", () => {
  const { store } = fresh();
  store.save({ agent: { id: "manager", name: "X", model: "m" } });
  const manager = store.get({ id: "manager" });
  assert.strictEqual(manager.name, "Manager");
  assert.strictEqual(manager.model, "m");
  assert.strictEqual(store.list().filter((a) => a.id === "manager").length, 1);
});

test("ghim: project khác vẫn thấy; xóa thì mất ở mọi nơi", async () => {
  const { registry, store } = fresh();
  registry.setWorkspace({ folder: tmp() });
  const dev = store.save({ agent: { name: "Dev" } });
  await layer({ registry }).move({ key: dev.id }); // workspace -> global
  registry.setWorkspace({ folder: tmp() });
  assert.strictEqual(store.get({ id: dev.id }).name, "Dev");
  assert.strictEqual(store.remove({ id: "manager" }), false);
  assert.strictEqual(store.remove({ id: dev.id }), true);
  assert.strictEqual(store.get({ id: dev.id }), null);
});

(async () => {
  let failed = 0;
  for (const { name, fn } of cases) {
    try {
      await fn();
      console.log(`✅ ${name}`);
    } catch (error) {
      failed++;
      console.error(`❌ ${name}\n   ${error.message}`);
    }
  }
  process.exitCode = failed ? 1 : 0;
})();
