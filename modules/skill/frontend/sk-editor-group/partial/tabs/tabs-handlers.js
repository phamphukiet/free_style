export function openTab(host, skill) {
  if (!host.openTabs.some((t) => t.id === skill.id))
    host.openTabs = [...host.openTabs, { id: skill.id, name: skill.name }];
  host.activeSkillId = skill.id;
}

export function closeTab(host, id) {
  const idx = host.openTabs.findIndex((t) => t.id === id);
  host.openTabs = host.openTabs.filter((t) => t.id !== id);
  if (host.activeSkillId !== id) return;
  host.activeSkillId = host.openTabs.length
    ? host.openTabs[Math.min(idx, host.openTabs.length - 1)].id
    : "";
}
