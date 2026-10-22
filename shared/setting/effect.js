// effect.js
// Renderer: nhận "effects" đã resolve từ backend và gọi handler theo target.
// Handler đăng ký sau vẫn được phát lại effect hiện hành (nhờ bảng `current`).
// Handler KHÔNG biết id setting nào — chỉ biết target + payload.

const handlers = new Map(); // target -> handler({ source, payload })
const current = new Map(); // "target|source" -> effect mới nhất
let started = false;

const keyOf = ({ target, source }) => `${target}|${source}`;

function dispatch(effect) {
  try {
    handlers.get(effect.target)?.(effect);
  } catch (error) {
    console.error(`[setting-effect] ${effect.target}:`, error);
  }
}

function accept(effect) {
  current.set(keyOf(effect), effect);
  dispatch(effect);
}

function start() {
  const api = window.api?.settings;
  if (started || !api?.getEffects) return;
  started = true;
  api.onEffects((batch) => batch.forEach(accept));
  api
    .getEffects()
    .then((batch) =>
      batch.filter((effect) => !current.has(keyOf(effect))).forEach(accept),
    )
    .catch(() => {}); // module settings vắng → bỏ qua êm
}

export function registerEffectHandler({ target, handler }) {
  handlers.set(target, handler);
  current.forEach((effect) => effect.target === target && dispatch(effect));
  start();
}