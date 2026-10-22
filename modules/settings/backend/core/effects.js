// effects.js
// (definition, value) → danh sách effect đã resolve.
// Biểu thức là DỮ LIỆU ($value, $option.data.x), không phải code → extension an toàn.
// `via` gọi hàm biến đổi đã đăng ký để mở rộng dữ liệu gọn (seed màu → đủ biến CSS).

const FORBIDDEN = new Set(["__proto__", "constructor", "prototype"]);

function lookup({ expr, ctx }) {
  let cur = ctx;
  for (const segment of expr.slice(1).split(".")) {
    const blocked =
      FORBIDDEN.has(segment) || cur === null || typeof cur !== "object";
    if (blocked || !Object.hasOwn(cur, segment)) return undefined;
    cur = cur[segment];
  }
  return cur;
}

function evaluateObject({ node, ctx }) {
  const out = {};
  for (const [key, child] of Object.entries(node)) {
    const value = evaluate({ node: child, ctx });
    if (value !== undefined) out[key] = value;
  }
  return out;
}

function evaluate({ node, ctx }) {
  if (typeof node === "string") {
    return node.startsWith("$") ? lookup({ expr: node, ctx }) : node;
  }
  if (Array.isArray(node))
    return node.map((child) => evaluate({ node: child, ctx }));
  if (node && typeof node === "object") return evaluateObject({ node, ctx });
  return node;
}

function applyVia({ via, raw, getTransform }) {
  const fn = getTransform({ name: via });
  if (!fn) return console.warn(`[settings] transform "${via}" chưa đăng ký`);
  try {
    return fn(raw);
  } catch (error) {
    return console.warn(`[settings] transform "${via}" lỗi:`, error.message);
  }
}

function buildOne({ def, effect, ctx, getTransform }) {
  const raw =
    effect.payload === undefined
      ? ctx.value
      : evaluate({ node: effect.payload, ctx });
  const payload = effect.via
    ? applyVia({ via: effect.via, raw, getTransform })
    : raw;
  return payload === undefined
    ? null
    : { target: effect.target, source: def.id, payload };
}

function createEffects({ getTransform }) {
  return {
    build({ def, value }) {
      const option =
        def.type === "select"
          ? def.options.find((o) => o.value === value)
          : undefined;
      const ctx = { value, option };
      return (def.effects || [])
        .map((effect) => buildOne({ def, effect, ctx, getTransform }))
        .filter(Boolean);
    },
  };
}

module.exports = { createEffects, evaluate };