// Dựng 1 tầng Storage cho (namespace, scope); trả null nếu scope chưa sẵn sàng.

const path = require("path");
const { createStorage } = require("../core/storage");
const { createMemoryAdapter } = require("../adapters/memory");
const { createJsonFileAdapter } = require("../adapters/json-file");
const { isReady, resolveDir, resolveLegacyFile } = require("../location/paths");

const PRIVATE_FILE_MODE = 0o600;
/**
 * @typedef {{ options: object, scope: string,
 *   globalDir: () => string, workspaceFolder: string|null }} BuildQuery
 */
function buildStorage({ options, scope, globalDir, workspaceFolder }) {
  const root = globalDir();
  if (!isReady({ scope, globalDir: root, workspaceFolder })) return null;

  const { namespace, adapter = "json-file", legacy, flushDelay } = options;
  if (adapter === "memory") {
    return createStorage({ adapter: createMemoryAdapter(), flushDelay });
  }

  const dir = resolveDir({ scope, globalDir: root, workspaceFolder });
  const jsonAdapter = createJsonFileAdapter({
    file: path.join(dir, `${namespace}.json`),
    legacyFile: resolveLegacyFile({ legacy, scope, dir }),
    fileMode: scope === "global" ? PRIVATE_FILE_MODE : undefined,
  });
  return createStorage({ adapter: jsonAdapter, flushDelay });
}

module.exports = { buildStorage };
