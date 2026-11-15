// expand-settings.js
// settings rút gọn { key: { label, default, options? } } → manifest đầy đủ cho settings engine.
// Host tự suy id, group, type, control. Lỗi khai báo ném Error để hiện ở dòng ext.

const KEY_PATTERN = /^[A-Za-z][A-Za-z0-9-]*$/;
const SCALARS = ["boolean", "number", "string"];
const CONTROLS = {
  boolean: "switch",
  select: "dropdown",
  number: "input",
  string: "text",
};
const OPTIONAL = ["min", "max", "description"];

const isObject = (v) =>
  v !== null && typeof v === "object" && !Array.isArray(v);
const valueOf = (option) => (isObject(option) ? option.value : option);

function toOption({ option, unit }) {
  if (isObject(option)) return option;
  return { value: option, label: unit ? `${option} ${unit}` : String(option) };
}

function pickType(spec) {
  if (!isObject(spec)) return "invalid";
  return Array.isArray(spec.options) ? "select" : typeof spec.default;
}

function assertSpec({ key, spec, type }) {
  const fail = (reason) => {
    throw new Error(`setting "${key}": ${reason}`);
  };
  if (!KEY_PATTERN.test(key))
    fail("tên phải bắt đầu bằng chữ, chỉ gồm chữ/số/gạch ngang");
  if (type === "invalid") fail("cần khai báo dạng { label, default }");
  if (type !== "select" && !SCALARS.includes(type))
    fail("default phải là true/false, số hoặc chuỗi");
  if (type === "select" && !spec.options.map(valueOf).includes(spec.default)) {
    fail("default phải nằm trong options");
  }
}

const pickOptional = (spec) =>
  Object.fromEntries(
    OPTIONAL.filter((key) => spec[key] !== undefined).map((key) => [
      key,
      spec[key],
    ]),
  );

function expandOne({ extId, group, key, spec, index }) {
  const type = pickType(spec);
  assertSpec({ key, spec, type });
  const def = {
    id: `${extId}.${key}`,
    group,
    label: spec.label ?? key,
    type,
    default: spec.default,
    control: spec.control ?? CONTROLS[type],
    order: 100 + index,
    ...pickOptional(spec),
  };
  if (type === "select") {
    def.options = spec.options.map((option) =>
      toOption({ option, unit: spec.unit }),
    );
  }
  return def;
}

/** @param {{ extId: string, name?: string, settings?: object }} args */
function expandSettings({ extId, name, settings }) {
  const group = typeof name === "string" && name ? name : extId;
  const defs = Object.entries(settings ?? {}).map(([key, spec], index) =>
    expandOne({ extId, group, key, spec, index }),
  );
  return { owner: extId, settings: defs };
}

module.exports = { expandSettings };
