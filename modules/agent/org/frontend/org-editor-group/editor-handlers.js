// editor-handlers.js
// LƯU Ý: actorRoleId đang hardcode "manager" — GĐ1 giả định chỉ manager thao tác UI này.
export async function selectPreset(host, presetId) {
  host.org = await window.api.org.selectPreset(presetId);
  window.dispatchEvent(new CustomEvent("org:changed"));
}

export async function addInstance(host) {
  if (!host.role) return;
  const name = window.prompt(
    `Tên agent cho vai trò "${host.role.name}":`,
    host.role.name,
  );
  if (!name) return;
  const agent = await window.api.agent.save(
    { name },
    { actorRoleId: "manager", targetRoleId: host.roleId },
  );
  await window.api.org.addInstance(host.roleId, agent.id);
  await host.loadInstances();
  window.dispatchEvent(new CustomEvent("org:changed"));
}

export async function removeInstance(host, instanceId) {
  if (!window.confirm("Xoá instance này khỏi org?")) return;
  await window.api.org.removeInstance(instanceId);
  await host.loadInstances();
  window.dispatchEvent(new CustomEvent("org:changed"));
}
