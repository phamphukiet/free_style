// presenter.js
// Dữ liệu thô của usecase → view-model cho UI.

const { statusOf } = require("../domain/extension");
const fieldsOf = ({ id, info, values }) =>
  (info?.manifest?.settings ?? []).map((def) => {
    const key = def.id.slice(id.length + 1);
    const { label, type, options, description } = def;
    return { key, label, type, options, description, value: values[key] };
  });

function extension({ id, record, info, values, running, file }) {
  const error = record.lastError?.message ?? info?.error ?? null;
  return {
    id,
    name: info?.name ?? id,
    language: record.language,
    enabled: record.enabled,
    status: statusOf({ error, running }),
    error,
    file,
    fields: fieldsOf({ id, info, values }),
  };
}

// usage: dòng gọi sẵn để user copy vào code ext.
function command({ module: moduleId, name, label, args }) {
  const params = Object.keys(args ?? {});
  const call = `commands.${moduleId}.${name}(${params.length ? `{ ${params.join(", ")} }` : ""})`;
  return { module: moduleId, name, label, usage: `${call}  // ${label}` };
}

module.exports = { extension, command };
