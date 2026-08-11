const store = require("./custom.store");
const settingsCommands = require("../../core/commands");
const { notifySchemaChanged } = require("../../core/notify");

function create_setting({
  id,
  label,
  group,
  description,
  options,
  default: def,
}) {
  if (!id || !/^[a-z0-9.-]+$/.test(id))
    throw new Error('id phải dạng "nhom.ten", chỉ chữ thường/số/./-');
  if (!Array.isArray(options) || !options.length)
    throw new Error("options phải là [{value,label}]");

  const definition = {
    id,
    label,
    group: group || "Custom",
    description: description || "",
    type: "enum",
    options,
    default: def ?? options[0].value,
  };

  const saved = store.readDefinitions();
  saved[id] = definition;
  store.writeDefinitions(saved);
  const registered = settingsCommands.registerSetting({
    ...definition,
    origin: "custom",
    locked: false,
  });
  notifySchemaChanged(registered);
  return definition;
}

function delete_setting({ id }) {
  const saved = store.readDefinitions();
  if (!saved[id]) throw new Error(`Custom setting "${id}" không tồn tại`);
  delete saved[id];
  store.writeDefinitions(saved);
  settingsCommands.deleteSetting(id);
  notifySchemaChanged({ id, deleted: true });
  return { id, deleted: true };
}

function getHint() {
  return (
    'Tạo setting tuỳ biến: action="create_setting" id="nhom.ten", label, group, ' +
    'options=[{value,label}]. Xoá bằng action="delete_setting" id=...'
  );
}

module.exports = { actions: { create_setting, delete_setting }, getHint };
