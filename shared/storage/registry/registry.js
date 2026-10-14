// Mở/tra cứu store theo namespace, giữ project hiện tại, flush khi thoát app.

const { createLayered } = require("../core/layered");
const { resolveGlobalDir } = require("../location/home");
const { SCOPES, isValidScope } = require("../location/paths");
const { buildStorage } = require("./factory");
const { followLastFolder } = require("../location/workspace");
const { onAppQuit } = require("./lifecycle");

/**
 * @typedef {{ namespace: string, scopes?: string[], adapter?: "json-file"|"memory",
 *   expose?: boolean, legacy?: { file: string, from?: "userData" },
 *   flushDelay?: number }} OpenOptions
 * @typedef {{ globalDir?: string, followState?: boolean }} RegistryOptions
 */
function createRegistry({ globalDir, followState = true } = {}) {
  const items = new Map(); // namespace -> { store, setLayer, options, scopes }
  let workspaceFolder = null;
  let following = false;
  let quitHooked = false;

  const getGlobalDir = () => (globalDir ??= resolveGlobalDir());
  const build = ({ options, scope }) =>
    buildStorage({ options, scope, globalDir: getGlobalDir, workspaceFolder });

  function setWorkspace({ folder }) {
    const next = folder || null;
    if (next === workspaceFolder) return;
    workspaceFolder = next;
    items.forEach(({ setLayer, options, scopes }) => {
      if (!scopes.includes("workspace")) return;
      setLayer({
        scope: "workspace",
        storage: build({ options, scope: "workspace" }),
      });
    });
  }

  function follow() {
    if (!followState || following) return;
    following = true;
    followLastFolder({ open, onFolder: setWorkspace });
  }

  function hookQuit() {
    if (quitHooked) return;
    quitHooked = true;
    onAppQuit({ handler: closeAll });
  }

  function assertScopes({ scopes }) {
    const bad =
      !scopes.length || !scopes.every((s) => isValidScope({ scope: s }));
    if (bad) throw new Error(`Scopes không hợp lệ: ${scopes}`);
  }

  function open(options) {
    const { namespace, scopes = SCOPES } = options;
    if (!namespace) throw new Error("storage.open cần namespace");
    if (items.has(namespace)) return items.get(namespace).store;
    assertScopes({ scopes });
    if (scopes.includes("workspace")) follow();

    const defaultScope = scopes.includes("workspace") ? "workspace" : "global";
    const layered = createLayered({ scopes, defaultScope });
    scopes.forEach((scope) =>
      layered.setLayer({ scope, storage: build({ options, scope }) }),
    );
    items.set(namespace, { ...layered, options, scopes });
    hookQuit();
    return layered.store;
  }

  function closeAll() {
    items.forEach(({ store }) => store.close());
    items.clear();
    following = false;
  }

  return {
    open,
    find: ({ namespace }) => items.get(namespace) || null,
    setWorkspace,
    getWorkspace: () => workspaceFolder,
    getGlobalDir,
    closeAll,
  };
}

module.exports = { createRegistry, registry: createRegistry() };
