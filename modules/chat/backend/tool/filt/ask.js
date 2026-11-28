// ask.js
// Gọi agent "manager" 1 lượt, có timeout. Lỗi (hạn mức, thiếu key, timeout) trả tín hiệu riêng,
// không bao giờ thành kết quả rỗng.

const config = require("../../config");
const { ask: defaultAsk } = require("../../../../../shared/command/ask.js");

function withTimeout(promise, ms) {
  let timer;
  const limit = new Promise((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`router timed out after ${ms} ms`)),
      ms,
    );
  });
  return Promise.race([promise, limit]).finally(() => clearTimeout(timer));
}

/** @param {{ system: string, text: string, ask?: Function, ms?: number }} args */
async function askRouter({
  system,
  text,
  ask = defaultAsk,
  ms = config.routerTimeoutMs,
}) {
  try {
    const raw = await withTimeout(ask({ system, text }), ms);
    return { ok: true, raw };
  } catch (error) {
    return { ok: false, kind: "infra", message: error.message };
  }
}

module.exports = { askRouter };
