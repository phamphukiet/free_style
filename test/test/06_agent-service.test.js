// 06_agent-service.test.js — hợp đồng service: chỉ đọc, thiếu/sai hợp đồng -> fallback.
const assert = require("assert");
const {
  registerCapability,
  getService,
} = require("../../shared/capability-registry");
const {
  createAgentService,
} = require("../../modules/agent/backend/agent/service");

const cases = [];
const test = (name, fn) => cases.push({ name, fn });
const NO_AGENTS = Object.freeze({ get: () => null });

test("module A không tồn tại -> B nhận fallback, không ném lỗi", () => {
  const api = getService({
    id: "agents-absent",
    needs: ["get"],
    fallback: NO_AGENTS,
  });
  assert.strictEqual(api, NO_AGENTS);
  assert.strictEqual(api.get({ id: "x" }), null);
});

test("service có nhưng thiếu method B cần -> fallback", () => {
  registerCapability({
    id: "agents-old",
    kind: "service",
    api: { list: () => [] },
  });
  const api = getService({
    id: "agents-old",
    needs: ["get"],
    fallback: NO_AGENTS,
  });
  assert.strictEqual(api, NO_AGENTS);
});

test("service đúng hợp đồng -> trả API thật", () => {
  const fake = { get: ({ id }) => ({ id }), list: () => [] };
  registerCapability({
    id: "agents-ok",
    kind: "service",
    api: createAgentService({ store: fake }),
  });
  const api = getService({
    id: "agents-ok",
    needs: ["get"],
    fallback: NO_AGENTS,
  });
  assert.deepStrictEqual(api.get({ id: "a" }), { id: "a" });
  assert.deepStrictEqual(api.get("a"), { id: "a" }); // nhánh tạm cho caller cũ
});

test("service công khai chỉ đọc: không có save/remove", () => {
  const api = createAgentService({
    store: { get() {}, list() {}, save() {}, remove() {} },
  });
  assert.deepStrictEqual(Object.keys(api).sort(), ["get", "list"]);
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
