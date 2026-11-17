// registry.js
// Quét modules/<id>/backend/setting/command/*.js của các module đang bật.
// Mẫu giống settings/sources/modules.js: lỗi 1 file chỉ gom vào errors, không sập bus.
// Không cache: require đã cache, quét lại chỉ tốn readdir.

const fs = require("fs");
const path = require("path");
const { COMMAND_DIR } = require("./spec");
const { normalizeFile } = require("./normalize");
const { validateCommand } = require("./validate");

function listFiles({ dir }) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".js"))
    .sort()
    .map((name) => path.join(dir, name));
}

function readCommands({ moduleId, file }) {
  try {
    return { commands: normalizeFile({ moduleId, exports: require(file) }) };
  } catch (error) {
    return { error: error.message };
  }
}

function accept({ state, command, from }) {
  const error = validateCommand({ command });
  if (error) return state.errors.push({ from, error });
  if (state.commands.has(command.id)) {
    return state.errors.push({ from, error: `${command.id}: id trùng` });
  }
  state.commands.set(command.id, command);
}

function loadFile({ state, moduleId, file }) {
  const from = `${moduleId}/${path.basename(file)}`;
  const { commands = [], error } = readCommands({ moduleId, file });
  if (error) return state.errors.push({ from, error });
  commands.forEach((command) => accept({ state, command, from }));
}

function loadModule({ state, moduleId, modulesDir }) {
  const dir = path.join(modulesDir, moduleId, ...COMMAND_DIR);
  listFiles({ dir }).forEach((file) => loadFile({ state, moduleId, file }));
}

/** @param {{ activeModules: string[], modulesDir: string }} deps */
function createRegistry({ activeModules, modulesDir }) {
  return {
    load() {
      const state = { commands: new Map(), errors: [] };
      activeModules.forEach((moduleId) =>
        loadModule({ state, moduleId, modulesDir }),
      );
      return { commands: [...state.commands.values()], errors: state.errors };
    },
  };
}

module.exports = { createRegistry };
