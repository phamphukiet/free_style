// guard.js
// Chặn manifest lỗi: manifest sai → KHÔNG kích hoạt, trả lỗi cho UI/toast.

const { OWNER_PATTERN, EXPR_PATTERN } = require("./spec");
const { isAllowedTarget } = require("./targets");
const { validateDefinition, validateOption } = require("../core/validate");

const isText = (v) => typeof v === "string" && v.trim() !== "";

// Tìm chuỗi "$..." không khớp cú pháp biểu thức an toàn.
function findBadExpression(node) {
  if (typeof node === "string") {
    return node.startsWith("$") && !EXPR_PATTERN.test(node) ? node : null;
  }
  if (!node || typeof node !== "object") return null;
  return Object.values(node).map(findBadExpression).find(Boolean) || null;
}

function effectError({ effect, trusted }) {
  if (!trusted && !isAllowedTarget({ target: effect.target })) {
    return `target "${effect.target}" không nằm trong whitelist`;
  }
  const bad = findBadExpression(effect.payload);
  return bad ? `biểu thức "${bad}" không hợp lệ` : null;
}

function definitionError({ def, owner, trusted }) {
  const error = validateDefinition({ def, owner });
  if (error) return error;
  const found = (def.effects || [])
    .map((effect) => effectError({ effect, trusted }))
    .find(Boolean);
  return found ? `${def.id}: ${found}` : null;
}

function presetError({ preset }) {
  if (!preset || !isText(preset.setting)) return "preset thiếu setting đích";
  return validateOption({ option: preset });
}

function shapeError(manifest) {
  if (!manifest || typeof manifest !== "object")
    return "manifest phải là object";
  if (!OWNER_PATTERN.test(manifest.owner || "")) return "owner sai định dạng";
  if (!Array.isArray(manifest.settings)) return "settings phải là mảng";
  const badPresets =
    manifest.presets !== undefined && !Array.isArray(manifest.presets);
  return badPresets ? "presets phải là mảng" : null;
}

function checkManifest({ manifest, trusted }) {
  const first = (items, fn) => items.map(fn).find(Boolean);
  const error =
    shapeError(manifest) ||
    first(manifest.settings, (def) =>
      definitionError({ def, owner: manifest.owner, trusted }),
    ) ||
    first(manifest.presets || [], (preset) => presetError({ preset }));
  return error ? { ok: false, error } : { ok: true };
}

module.exports = { checkManifest };