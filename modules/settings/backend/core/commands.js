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
  if (def.type === "number") {
    const num = Number(value);
    if (Number.isNaN(num)) throw new Error(`"${def.id}" phải là số`);
    if (def.min != null && num < def.min)
      throw new Error(`"${def.id}" tối thiểu ${def.min}`);
    if (def.max != null && num > def.max)
      throw new Error(`"${def.id}" tối đa ${def.max}`);
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

function getSummary() {
  const values = getValues();
  return registry.getAllDefinitions().map((def) => ({
    id: def.id,
    type: def.type,
    allowed: def.type === "enum" ? def.options.map((o) => o.value) : undefined,
    range: def.type === "number" ? [def.min, def.max] : undefined,
    current: values[def.id],
  }));
}

function getCompactSummary() {
  return getSummary()
    .map((s) => {
      const extra = s.allowed
        ? `:${s.allowed.join("|")}`
        : s.range
          ? `:${s.range[0]}-${s.range[1]}`
          : "";
      return `${s.id}(${s.type}${extra})=${s.current}`;
    })
    .join("; ");
}

function deleteSetting(id) {
  if (!registry.getDefinition(id)) throw new Error(`Setting "${id}" chưa tồn tại`);
  registry.unregisterDefinition(id);
  const stored = store.readValues();
  delete stored[id];
  store.writeValues(stored);
  return true;
}
// nhớ export thêm deleteSetting

module.exports = {
  getDefinitions,
  getValues,
  getValue,
  setValue,
  resetValue,
  registerSetting,
  getSummary,
  getCompactSummary,
  deleteSetting,
};
