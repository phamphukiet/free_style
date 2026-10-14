// skill-rule-loader.js
// Rule/skill là module tùy chọn: preload luôn có window.api.rule/skill nhưng handler
// biến mất khi module bị xóa (invoke reject) -> mỗi lệnh gọi tự bắt lỗi, trả [].

const optional = (call) =>
  Promise.resolve()
    .then(call)
    .catch(() => []);

/** @param {{ agentId: string }} args */
export async function loadAssignedRulesAndSkills({ agentId }) {
  if (!agentId) return { rules: [], skills: [] };

  const [allRules, skills] = await Promise.all([
    optional(() => window.api.rule.list()),
    optional(() => window.api.skill.listByAgent(agentId)),
  ]);

  const rules = (allRules || []).filter((r) =>
    (r.agentIds || []).includes(agentId),
  );
  return { rules, skills: skills || [] };
}
