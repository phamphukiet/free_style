// resolve-entity.js
// Đổi tên người dùng gõ → định danh thật. Chỉ chạy khi MỌI tên đã rõ ràng.
// Trả { args, targets } | { missing } (không thấy) | { crowded } (nhiều kết quả).

const {
  getCapability,
} = require("../../../../shared/core/capability-registry.js");
const { createLog } = require("../../../../shared/log");
const log = createLog({ filename: __filename, topic: "command" });

const list = (value) => (Array.isArray(value) ? value : [value]);

async function pickOne({ kind, name }) {
  const entity = getCapability({ kind: "entity", id: kind });
  if (!entity) throw new Error(`Chưa có bộ tìm "${kind}"`);
  const hits = await entity.find({ text: name });
    log.say({
      task: "Resolve",
      message: `${kind} "${name}" -> ${hits.length} hit(s)`,
    });
  if (hits.length === 1) return { hit: hits[0] };
  return hits.length === 0 ? { missing: name } : { crowded: { name, hits } };
}

/** @param {{ schema: object, values: object }} args */
async function resolveEntities({ schema, values }) {
  const args = { ...values };
  const targets = [];
  for (const [key, spec] of Object.entries(schema)) {
    if (!spec.entity) continue;
    const picked = await Promise.all(
      list(values[key]).map((name) => pickOne({ kind: spec.entity, name })),
    );
    const problem = picked.find((p) => !p.hit);
    if (problem) return problem;
    const hits = picked.map((p) => p.hit);
    args[key] = spec.many ? hits.map((h) => h.key) : hits[0].key;
    targets.push(...hits);
  }
  return { args, targets };
}

module.exports = { resolveEntities };
