// create-extension.js — UC2: tạo ext mới = thư mục + file code RỖNG + record trạng thái Tắt.
// Code mẫu không ghi vào file; UI hiển thị để user tự copy.

const { buildRecord, DEFAULT_LANGUAGE } = require("../domain/extension");
const { pickUniqueId } = require("../domain/ext-id");

function assertInput({ name, language, codeStore }) {
  if (!String(name ?? "").trim()) throw new Error("Cần nhập tên extension");
  if (!codeStore.languages().some((item) => item.id === language)) {
    throw new Error(`Chưa hỗ trợ ngôn ngữ "${language}"`);
  }
}

/** @param {{ repo, codeStore, catalog, reserved: Set<string>, broadcast: Function }} deps */
function createCreateExtension({
  repo,
  codeStore,
  catalog,
  reserved,
  broadcast,
}) {
  return async function createExtension({ name, language = DEFAULT_LANGUAGE }) {
    assertInput({ name, language, codeStore });
    const taken = new Set([
      ...Object.keys(repo.all()),
      ...codeStore.listIds(),
      ...reserved,
    ]);
    const id = pickUniqueId({ name, taken });
    await codeStore.createEmpty({ id, language });
    repo.save({ id, record: buildRecord({ language }) });
    catalog.set({
      id,
      info: { name: id, manifest: null, error: null, code: "" },
    });
    broadcast();
    return {
      id,
      file: codeStore.fileOf({ id, language }),
      sample: codeStore.sampleOf({ language }),
    };
  };
}

module.exports = { createCreateExtension };
