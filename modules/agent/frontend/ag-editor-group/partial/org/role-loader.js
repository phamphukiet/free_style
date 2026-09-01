// role-loader.js
export async function loadRoleDetail(host) {
  const [org, agents] = await Promise.all([
    window.api.org.get(),
    window.api.agent.list(),
  ]);
  const roleId = host.roleState.roleId;
  const role = org?.roles.find((r) => r.id === roleId) || null;
  const instances = roleId ? await window.api.org.listInstances(roleId) : [];
  host.roleState = {
    ...host.roleState,
    role,
    orgRoles: org?.roles || [],
    instances,
    allAgents: agents || [],
  };
}
