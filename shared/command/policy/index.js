// policy/index.js
// Hàm thuần: ({ caller, cmd, args }) → { decision: "allow" | "ask" | "deny", reason? }.
// Không import bus/registry/electron.

const { AI_RULES, EXT_RULES, deny } = require("./rules");

const RULES_BY_KIND = { ai: AI_RULES, ext: EXT_RULES, user: [] };

function evaluate({ caller, cmd, args }) {
  const kind = caller?.kind;
  if (!Object.hasOwn(RULES_BY_KIND, kind))
    return deny("Người gọi không xác định.");
  for (const rule of RULES_BY_KIND[kind]) {
    const verdict = rule({ caller, cmd, args });
    if (verdict) return verdict;
  }
  return { decision: "allow" };
}

module.exports = { evaluate };
