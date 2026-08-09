// commands.js
// Lớp "lệnh" trung tâm — cả UI (qua IPC settings:set) lẫn AI/agent
// (qua IPC settings:command) đều gọi vào đây, không có đường tắt nào khác
// để đổi setting. Đảm bảo mọi thay đổi đều đi qua validate.

const registry = require("./registry");
const store = require("./store");

function getDefinitions() {
  return registry.getAllDefinitions();
}

function getValues() {
  const stored = store.readValues();
  const result = {};
  registry.getAllDefinitions().forEach((def) => {
    result[def.id] = def.id in stored ? stored[def.id] : def.default;
  });
  return result;
}

function getValue(id) {
  return getValues()[id];
}

function validateValue(def, value) {
  if (def.type === "enum") {
    const allowed = (def.options || []).map((o) => o.value);
    if (!allowed.includes(value)) {
      throw new Error(
        `Giá trị "${value}" không hợp lệ cho "${def.id}". Cho phép: ${allowed.join(", ")}`,
      );
    }
  }
}

function setValue(id, value) {
  const def = registry.getDefinition(id);
  if (!def) throw new Error(`Setting "${id}" chưa được đăng ký`);
  validateValue(def, value);
  const stored = store.readValues();
  stored[id] = value;
  store.writeValues(stored);
  return value;
}

function resetValue(id) {
  const def = registry.getDefinition(id);
  if (!def) throw new Error(`Setting "${id}" chưa được đăng ký`);
  const stored = store.readValues();
  delete stored[id];
  store.writeValues(stored);
  return def.default;
}

function registerSetting(def) {
  if (!def || !def.id || !def.label || !def.group || !def.type) {
    throw new Error("Setting definition cần có: id, label, group, type");
  }
  if (
    def.type === "enum" &&
    (!Array.isArray(def.options) || !def.options.length)
  ) {
    throw new Error(`Setting type "enum" cần có "options"`);
  }
  return registry.registerDefinition(def);
}

module.exports = {
  getDefinitions,
  getValues,
  getValue,
  setValue,
  resetValue,
  registerSetting,
};
