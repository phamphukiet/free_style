// index.js
// API công khai của bus lệnh. Vào/ra đều là JSON.
// createBus nhận deps (bridge, confirm, audit, isAiEnabled) qua tham số: test không cần Electron.
// Bus mặc định tự dựng lười; main chỉ cần gọi registerCommandIpc() một lần lúc khởi động.

const path = require("path");
const { getService } = require("../core/capability-registry");
const { AI_SWITCH_SETTING } = require("./spec");
const { createRegistry } = require("./registry");
const { runCommand, canRun } = require("./run");
const { publicCaller } = require("./result");
const { evaluate } = require("./policy");
const { summary, detail } = require("./view");

const NOOP_DEPS = Object.freeze({
  bridge: null,
  audit: { record: () => {} },
  confirm: { ask: async () => ({ approved: false }) }, // không có UI hỏi = từ chối
  isAiEnabled: () => true,
});

const notFound = (id) => ({
  ok: false,
  code: "NOT_FOUND",
  error: `Lệnh "${id}" không tồn tại.`,
});
const DISABLED = {
  ok: false,
  code: "DISABLED",
  error: "Người dùng đã tắt quyền điều khiển app của AI.",
};

/** @param {{ activeModules: string[], modulesDir: string, deps?: object }} input */
function createBus({ activeModules, modulesDir, deps: given = {} }) {
  const deps = { ...NOOP_DEPS, ...given };
  const registry = createRegistry({ activeModules, modulesDir });
  const aiOff = ({ caller }) => caller?.kind === "ai" && !deps.isAiEnabled();

  const isVisible = ({ caller, cmd }) =>
    canRun({ cmd, caller, deps }) &&
    evaluate({ caller, cmd, args: {} }).decision !== "deny";

  const visibleTo = ({ caller }) =>
    aiOff({ caller })
      ? []
      : registry.load().commands.filter((cmd) => isVisible({ caller, cmd }));

  const findOne = ({ caller, id }) =>
    visibleTo({ caller }).find((cmd) => cmd.id === id) ?? null;

  function list({ caller, module } = {}) {
    const all = visibleTo({ caller });
    const picked = module ? all.filter((cmd) => cmd.module === module) : all;
    return { commands: picked.map(summary) };
  }

  function describe({ caller, id } = {}) {
    const cmd = findOne({ caller, id });
    return cmd ? detail(cmd) : null;
  }

  // Lệnh ẩn và lệnh không tồn tại trả cùng 1 lỗi để không lộ sự tồn tại.
  async function run({ caller, id, args } = {}) {
    if (aiOff({ caller })) return DISABLED;
    const cmd = findOne({ caller, id });
    if (cmd) return runCommand({ cmd, args, caller, deps });
    deps.audit.record({
      caller: publicCaller(caller),
      id: String(id).slice(0, 80),
      decision: "not_found",
      outcome: "not_run",
    });
    return notFound(id);
  }

  return { list, describe, run, errors: () => registry.load().errors };
}

// Công tắc tắt khẩn cấp: setting global do người dùng đổi trên UI. Thiếu settings = bật.
function isAiEnabled() {
  const settings = getService({
    id: "settings",
    needs: ["get"],
    fallback: null,
  });
  return settings?.get({ id: AI_SWITCH_SETTING, fallback: true }) !== false;
}

const state = { bus: null, bridge: null };

function ensureBus() {
  if (state.bus) return state.bus;
  state.bridge = require("./renderer-bridge").createBridge();
  state.bus = createBus({
    activeModules: require("../../modules/active-modules.js"),
    modulesDir: path.join(__dirname, "..", "..", "modules"),
    deps: {
      bridge: state.bridge,
      confirm: require("./confirm"),
      audit: require("./audit"),
      isAiEnabled,
    },
  });
  return state.bus;
}

function registerCommandIpc() {
  const bus = ensureBus();
  require("./ipc").registerCommandIpc({ bridge: state.bridge });
  bus
    .errors()
    .forEach(({ from, error }) => console.warn(`[command] ${from}: ${error}`));
}

module.exports = {
  createBus,
  registerCommandIpc,
  list: (opts) => ensureBus().list(opts),
  describe: (opts) => ensureBus().describe(opts),
  run: (opts) => ensureBus().run(opts),
  errors: () => ensureBus().errors(),
};