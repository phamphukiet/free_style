// code-store.js
// Cài đặt port code-store: code ext là file thật ~/.vibe/extensions/<id>/<entry>.

const fs = require("fs");
const path = require("path");
const { isValidId } = require("../../domain/ext-id");
const { DEFAULT_LANGUAGE } = require("../../domain/extension");
const { getRuntime, listRuntimes } = require("../runtimes");

/** @param {{ rootDir: string }} deps */
function createCodeStore({ rootDir }) {
  function dirOf({ id }) {
    if (!isValidId(id)) throw new Error(`id không hợp lệ: ${id}`); // chặn path traversal
    return path.join(rootDir, id);
  }

  const fileOf = ({ id, language }) =>
    path.join(dirOf({ id }), getRuntime({ language }).entry);

  function listIds() {
    if (!fs.existsSync(rootDir)) return [];
    return fs
      .readdirSync(rootDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && isValidId(entry.name))
      .map((entry) => entry.name);
  }

  function detectLanguage({ id }) {
    const found = listRuntimes().find(({ entry }) =>
      fs.existsSync(path.join(dirOf({ id }), entry)),
    );
    return found ? found.id : DEFAULT_LANGUAGE;
  }

  return {
    rootDir,
    languages: () => listRuntimes().map(({ id, label }) => ({ id, label })),
    sampleOf: ({ language }) => getRuntime({ language }).sample(),
    fileOf,
    listIds,
    detectLanguage,
    async createEmpty({ id, language }) {
      const file = fileOf({ id, language });
      await fs.promises.mkdir(path.dirname(file), { recursive: true });
      await fs.promises.writeFile(file, "", { encoding: "utf-8", flag: "wx" });
    },
    read: ({ id, language }) =>
      fs.promises.readFile(fileOf({ id, language }), "utf-8"),
    write: ({ id, language, code }) =>
      fs.promises.writeFile(fileOf({ id, language }), code, "utf-8"),
    remove: ({ id }) =>
      fs.promises.rm(dirOf({ id }), { recursive: true, force: true }),
  };
}

module.exports = { createCodeStore };
