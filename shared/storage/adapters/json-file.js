// Adapter file JSON: đọc đồng bộ lúc mở (tự khôi phục), ghi atomic (tmp + rename),
// tạo .backup khi đóng, nhập file cũ (legacy) lần đầu.

const fs = require("fs");
const path = require("path");

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

/** @typedef {{ file: string, legacyFile?: string, fileMode?: number }} JsonFileOptions */
function createJsonFileAdapter({ file, legacyFile, fileMode }) {
  const tmpFile = `${file}.tmp`;
  const backupFile = `${file}.backup`;
  let data = {};
  let chain = Promise.resolve();

  // object = đọc được | undefined = chưa có file | null = file hỏng
  function tryRead({ target }) {
    try {
      const parsed = JSON.parse(fs.readFileSync(target, "utf-8"));
      return isPlainObject(parsed) ? parsed : null;
    } catch (error) {
      return error.code === "ENOENT" ? undefined : null;
    }
  }

  const serialize = () => JSON.stringify(data, null, 2);

    function writeSync() {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(tmpFile, serialize(), {
        encoding: "utf-8",
        mode: fileMode,
      });
      fs.renameSync(tmpFile, file);
    }

    async function writeAsync() {
      await fs.promises.mkdir(path.dirname(file), { recursive: true });
      await fs.promises.writeFile(tmpFile, serialize(), {
        encoding: "utf-8",
        mode: fileMode,
      });
      await fs.promises.rename(tmpFile, file);
    }

  // Dùng dữ liệu từ nguồn khác (backup/legacy) và ghi lại file chính.
  function adopt({ source }) {
    data = source;
    try {
      writeSync();
    } catch (error) {
      console.error(`[storage] không ghi được ${file}:`, error.message);
    }
  }

  function recoverFromBackup() {
    console.error(
      `[storage] ${path.basename(file)} hỏng, khôi phục từ .backup`,
    );
    try {
      fs.renameSync(file, `${file}.corrupt`);
    } catch {
      /* file không còn để đổi tên */
    }
    return tryRead({ target: backupFile }) || {};
  }

  function load() {
    const main = tryRead({ target: file });
    const legacy =
      main === undefined && legacyFile
        ? tryRead({ target: legacyFile })
        : undefined;
    if (main) data = main;
    else if (main === null) adopt({ source: recoverFromBackup() });
    else if (legacy) adopt({ source: legacy });
    return { ...data };
  }

  function apply({ insert = {}, remove = [] }) {
    Object.assign(data, insert);
    remove.forEach((key) => delete data[key]);
  }

  // Các lần ghi bất đồng bộ xếp hàng; mỗi lần ghi toàn bộ `data` hiện tại.
  function save(batch) {
    apply(batch);
    chain = chain.catch(() => {}).then(writeAsync);
    return chain;
  }

  function saveSync(batch) {
    apply(batch);
    writeSync();
  }

  function close() {
    try {
      if (fs.existsSync(file)) fs.copyFileSync(file, backupFile);
    } catch (error) {
      console.error("[storage] backup lỗi:", error.message);
    }
  }

  return { load, save, saveSync, close };
}

module.exports = { createJsonFileAdapter };
