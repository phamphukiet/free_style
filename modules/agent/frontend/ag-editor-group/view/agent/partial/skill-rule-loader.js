export async function loadAssignedRulesAndSkills(agentId) {
  if (!agentId) return { rules: [], skills: [] };

  const [allRules, skills] = await Promise.all([
    window.api.rule?.list ? window.api.rule.list() : Promise.resolve([]),
    window.api.skill?.listByAgent
      ? window.api.skill.listByAgent(agentId)
      : Promise.resolve([]),
  ]);

  const rules = (allRules || []).filter((r) =>
    (r.agentIds || []).includes(agentId),
  );

  return { rules, skills: skills || [] };
}
