// 07_settings.test.js — core settings: validate, registry, tầng giá trị, effects, events, mẫu.
const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { createRegistry: createStorageRegistry } = require("../shared/storage");
const { createRegistry } = require("../modules/settings/backend/core/registry");
const { createEngine } = require("../modules/settings/backend/core/engine");
const {
  validateDefinition,
} = require("../modules/settings/backend/core/validate");

const cases = [];
const test = (name, fn) => cases.push({ name, fn });
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "settings-"));
const tick = () => new Promise((resolve) => setTimeout(resolve, 20));

const FONT = {
  id: "editor.fontSize",
  group: "Editor",
  label: "Font",
  type: "number",
  default: 14,
  min: 6,
  max: 72,
  effects: [{ target: "monaco.options", payload: { fontSize: "$value" } }],
};
const THEME = {
  id: "appearance.theme",
  group: "A",
  label: "Theme",
  type: "select",
  default: "dark",
  scope: "global",
  options: [
    { value: "dark", label: "Dark", data: { vars: { "--bg": "#111" } } },
  ],
  effects: [{ target: "css.vars", payload: "$option.data.vars" }],
};
const BASE = [
  { owner: "editor", settings: [FONT] },
  { owner: "appearance", settings: [THEME] },
];

const source = (id, trusted, manifests) => ({
  id,
  trusted,
  list: () => manifests.map((manifest) => ({ from: manifest.owner, manifest })),
});

function makeEngine({ modules = BASE, extensions = [] } = {}) {
  const reg = createStorageRegistry({ globalDir: tmp(), followState: false });
  const engine = createEngine({
    registry: createRegistry({
      listSources: () => [
        source("module", true, modules),
        source("extension", false, extensions),
      ],
    }),
    valuesStore: reg.open({ namespace: "settings" }),
    presetsStore: reg.open({
      namespace: "settings-presets",
      scopes: ["global"],
    }),
    getTransform: ({ name }) => (name === "double" ? (n) => n * 2 : undefined),
  });
  return { reg, engine };
}

test("validate: sai owner / default ngoài min bị từ chối", () => {
  assert.ok(
    validateDefinition({ def: { ...FONT, id: "other.x" }, owner: "editor" }),
  );
  assert.ok(
    validateDefinition({ def: { ...FONT, default: 1 }, owner: "editor" }),
  );
  assert.strictEqual(validateDefinition({ def: FONT, owner: "editor" }), null);
});

test("registry: extension không chiếm owner module và không dùng target ngoài whitelist", () => {
  const { engine } = makeEngine({
    extensions: [
      { owner: "editor", settings: [{ ...FONT, id: "editor.x" }] },
      {
        owner: "mine",
        settings: [
          { ...FONT, id: "mine.a", effects: [{ target: "fs.write" }] },
        ],
      },
    ],
  });
  assert.strictEqual(engine.errors().length, 2);
  assert.deepStrictEqual(
    engine
      .list()
      .map((i) => i.def.id)
      .sort(),
    ["appearance.theme", "editor.fontSize"],
  );
});

test("tầng: default < global < workspace; giá trị = default thì xoá key", async () => {
  const { reg, engine } = makeEngine();
  assert.strictEqual(engine.inspect({ id: FONT.id }).value, 14);
  engine.set({ id: FONT.id, value: 20 });
  assert.strictEqual(engine.inspect({ id: FONT.id }).value, 20);
  reg.setWorkspace({ folder: tmp() });
  engine.set({ id: FONT.id, value: 30, scope: "workspace" });
  assert.strictEqual(engine.inspect({ id: FONT.id }).scope, "workspace");
  engine.reset({ id: FONT.id, scope: "workspace" });
  engine.set({ id: FONT.id, value: 14 });
  assert.deepStrictEqual(reg.find({ namespace: "settings" }).store.keys(), []);
});

test("scope global bỏ qua workspace; giá trị sai kiểu/ngoài khoảng bị từ chối", () => {
  const { reg, engine } = makeEngine();
  reg.setWorkspace({ folder: tmp() });
  engine.addPreset({
    id: THEME.id,
    option: { value: "night", label: "Night" },
  });
  engine.set({ id: THEME.id, value: "night", scope: "workspace" });
  assert.strictEqual(engine.inspect({ id: THEME.id }).workspace, undefined);
  assert.throws(() => engine.set({ id: FONT.id, value: 999 }), /lớn hơn/);
  assert.throws(() => engine.set({ id: FONT.id, value: "x" }), /số/);
});

test("effects: $value, $option.data, via, chặn __proto__", () => {
  const extra = {
    ...FONT,
    id: "x.a",
    effects: [
      { target: "t", payload: "$value", via: "double" },
      { target: "t2", payload: "$option.__proto__" },
    ],
  };
  const { engine } = makeEngine({
    modules: [...BASE, { owner: "x", settings: [extra] }],
  });
  assert.deepStrictEqual(engine.effectsFor({ id: FONT.id }), [
    { target: "monaco.options", source: FONT.id, payload: { fontSize: 14 } },
  ]);
  assert.deepStrictEqual(engine.effectsFor({ id: THEME.id })[0].payload, {
    "--bg": "#111",
  });
  assert.deepStrictEqual(engine.effectsFor({ id: "x.a" }), [
    { target: "t", source: "x.a", payload: 28 },
  ]);
});

test("events: set phát {ids} đúng 1 lần", async () => {
  const { engine } = makeEngine();
  const seen = [];
  engine.onDidChange({ listener: ({ ids }) => seen.push(ids) });
  engine.set({ id: FONT.id, value: 20 });
  await tick();
  assert.deepStrictEqual(seen, [[FONT.id]]);
});

test("mẫu: thêm, chọn được, trùng/sai type bị từ chối, xoá", () => {
  const { engine } = makeEngine();
  engine.addPreset({
    id: THEME.id,
    option: { value: "night", label: "Night", data: { bg: "000000" } },
  });
  assert.strictEqual(engine.set({ id: THEME.id, value: "night" }), "night");
  assert.throws(
    () =>
      engine.addPreset({
        id: THEME.id,
        option: { value: "night", label: "x" },
      }),
    /đã tồn tại/,
  );
  assert.throws(
    () => engine.addPreset({ id: FONT.id, option: { value: "a", label: "a" } }),
    /select/,
  );
  engine.removePreset({ id: THEME.id, value: "night" });
  assert.strictEqual(engine.inspect({ id: THEME.id }).value, "dark");
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
