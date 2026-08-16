// commands.js
// Trách nhiệm duy nhất: business logic settings — get/set giá trị, tạo/sửa/xoá
// setting origin "create", thêm mẫu cho setting origin "root". ipc.js và chat
// agent (tool-calling, phase sau) đều gọi qua đây, không đụng trực tiếp store/loader.

const store = require("./store");
const loader = require("./loader");

function getAll() {
  return loader.loadAll();
}

function listGroups() {
  return [...new Set(getAll().map((s) => s.group))];
}

function getValue(id) {
  return getAll().find((s) => s.id === id)?.value;
}

function setValue(id, value) {
  store.setValue(id, value);
  return value;
}

function addPreset(id, preset) {
  store.addPreset(id, preset);
  return getAll().find((s) => s.id === id);
}

// Root schema do kỹ sư viết tay — chỉ setting "create" được tạo/sửa/xoá qua đây.
function createSetting(def) {
  if (!def.id || !def.label) throw new Error("Thiếu id hoặc label");
  store.saveCreated({ type: "string", default: "", ...def });
  return def;
}

function updateSetting(id, patch) {
  const item = getAll().find((s) => s.id === id);
  if (!item || item.origin !== "create")
    throw new Error("Chỉ sửa được setting do user/AI tự tạo");
  store.saveCreated({ ...item, ...patch, id });
  return getAll().find((s) => s.id === id);
}

function deleteSetting(id) {
  const item = getAll().find((s) => s.id === id);
  if (!item || item.origin !== "create")
    throw new Error("Chỉ xoá được setting do user/AI tự tạo");
  store.deleteCreated(id);
  return true;
}

function getSummary() {
  return getAll().map(({ id, label, group, value }) => ({
    id,
    label,
    group,
    value,
  }));
}

function getCompactSummary() {
  return getAll()
    .map((s) => `${s.id}=${s.value}`)
    .join(", ");
}

module.exports = {
  getAll,
  listGroups,
  getValue,
  setValue,
  addPreset,
  createSetting,
  updateSetting,
  deleteSetting,
  getSummary,
  getCompactSummary,
};
