// 04_storage.test.js — shared/storage: cache, debounce, recovery, legacy, layered.
const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { createRegistry, createStorage } = require("../shared/storage");
const { createMemoryAdapter } = require("../shared/storage/adapters/memory");

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "storage-"));
const newRegistry = ({ globalDir }) =>
  createRegistry({ globalDir, followState: false });
const openGlobal = ({ reg, namespace }) =>
  reg.open({ namespace, scopes: ["global"] });
const cases = [];
const test = (name, fn) => cases.push({ name, fn });

test("get/set/delete trả bản sao, set null thì xóa", async () => {
  const store = createStorage({ adapter: createMemoryAdapter() });
  await store.set({ key: "a", value: { n: 1 } });
  const copy = store.get({ key: "a" });
  copy.n = 99;
  assert.strictEqual(store.get({ key: "a" }).n, 1);
  await store.set({ key: "a", value: null });
  assert.strictEqual(store.get({ key: "a", fallback: "x" }), "x");
});

test("nhiều set liên tiếp chỉ ghi 1 lần", async () => {
  const adapter = createMemoryAdapter();
  const save = adapter.save;
  let saves = 0;
  adapter.save = (batch) => {
    saves++;
    return save(batch);
  };
  const store = createStorage({ adapter, flushDelay: 20 });
  await Promise.all(
    [1, 2, 3].map((n) => store.set({ key: `k${n}`, value: n })),
  );
  assert.strictEqual(saves, 1);
  assert.deepStrictEqual(Object.keys(adapter.snapshot()).sort(), [
    "k1",
    "k2",
    "k3",
  ]);
});

test("json-file: ghi atomic và nạp lại được", async () => {
  const globalDir = tmp();
  const a = openGlobal({ reg: newRegistry({ globalDir }), namespace: "demo" });
  await a.set({ key: "x", value: { v: 1 } });
  assert.ok(!fs.existsSync(path.join(globalDir, "demo.json.tmp")));
  const b = openGlobal({ reg: newRegistry({ globalDir }), namespace: "demo" });
  assert.deepStrictEqual(b.get({ key: "x" }), { v: 1 });
});

test("file hỏng thì khôi phục từ .backup", async () => {
  const globalDir = tmp();
  const reg = newRegistry({ globalDir });
  await openGlobal({ reg, namespace: "demo" }).set({ key: "x", value: 1 });
  reg.closeAll(); // tạo .backup
  fs.writeFileSync(path.join(globalDir, "demo.json"), "{hỏng");
  const again = openGlobal({
    reg: newRegistry({ globalDir }),
    namespace: "demo",
  });
  assert.strictEqual(again.get({ key: "x" }), 1);
  assert.ok(fs.existsSync(path.join(globalDir, "demo.json.corrupt")));
});

test("legacy: nhập file cũ lần đầu", () => {
  const globalDir = tmp();
  fs.writeFileSync(
    path.join(globalDir, "old.json"),
    JSON.stringify({ a: { keys: [] } }),
  );
  const store = newRegistry({ globalDir }).open({
    namespace: "creds",
    scopes: ["global"],
    legacy: { file: "old.json" },
  });
  assert.deepStrictEqual(store.get({ key: "a" }), { keys: [] });
  assert.ok(fs.existsSync(path.join(globalDir, "creds.json")));
});

test("closeAll ghi ngay phần còn chờ debounce", () => {
  const globalDir = tmp();
  const reg = newRegistry({ globalDir });
  openGlobal({ reg, namespace: "demo" }).set({ key: "x", value: 1 });
  reg.closeAll();
  const raw = fs.readFileSync(path.join(globalDir, "demo.json"), "utf-8");
  assert.deepStrictEqual(JSON.parse(raw), { x: 1 });
});

test("namespace chỉ global thì từ chối scope workspace", () => {
  const store = openGlobal({
    reg: newRegistry({ globalDir: tmp() }),
    namespace: "cred",
  });
  assert.throws(
    () => store.set({ key: "k", value: 1, scope: "workspace" }),
    /scope/,
  );
});

test("layered: ghi đè, ghim bằng move, đổi project vẫn thấy mục đã ghim", async () => {
  const [globalDir, projA, projB] = [tmp(), tmp(), tmp()];
  const reg = newRegistry({ globalDir });
  reg.setWorkspace({ folder: projA });
  const store = reg.open({ namespace: "rules" });
  const events = [];
  store.onDidChange({ listener: (e) => events.push(e) });

  await store.set({ key: "r1", value: "local" }); // mặc định: workspace
  assert.strictEqual(store.inspect({ key: "r1" }).scope, "workspace");
  await store.move({ key: "r1" }); // ghim lên global
  assert.strictEqual(store.inspect({ key: "r1" }).scope, "global");
  await store.set({ key: "r3", value: "only-A" });

  reg.setWorkspace({ folder: projB });
  assert.strictEqual(store.get({ key: "r1" }), "local"); // đã ghim
  assert.strictEqual(store.get({ key: "r3" }), undefined); // chưa ghim
  assert.ok(events.some((e) => e.key === "r3" && e.scope === "workspace"));

  await store.set({ key: "r1", value: "override" });
  await store.delete({ key: "r1", scope: "workspace" }); // bỏ ghi đè
  assert.strictEqual(store.get({ key: "r1" }), "local");

  reg.setWorkspace({ folder: projA });
  assert.strictEqual(store.get({ key: "r3" }), "only-A");
});
const { resolveGlobalDir } = require("../shared/storage/location/home");

test("global mặc định là ~/.vibe, VIBE_HOME ghi đè", () => {
  const home = resolveGlobalDir({ env: {}, homedir: () => "/home/u" });
  assert.strictEqual(home, path.join("/home/u", ".vibe"));
  const custom = resolveGlobalDir({ env: { VIBE_HOME: "/tmp/x" } });
  assert.strictEqual(custom, path.resolve("/tmp/x"));
});

test("project trùng thư mục global thì tầng workspace tự tắt", async () => {
  const home = tmp();
  const reg = newRegistry({ globalDir: path.join(home, ".vibe") });
  reg.setWorkspace({ folder: home });
  const store = reg.open({ namespace: "rules" });
  await store.set({ key: "r", value: 1 }); // mặc định workspace, nhưng rơi về global
  assert.strictEqual(store.inspect({ key: "r" }).scope, "global");
});

test("file global ghi quyền 600", async () => {
  if (process.platform === "win32") return;
  const globalDir = tmp();
  await openGlobal({ reg: newRegistry({ globalDir }), namespace: "demo" }).set({
    key: "x",
    value: 1,
  });
  const mode = fs.statSync(path.join(globalDir, "demo.json")).mode & 0o777;
  assert.strictEqual(mode, 0o600);
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
