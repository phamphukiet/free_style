// role-loader.js
export async function loadRoleDetail(host) {
  const [org, agents] = await Promise.all([
    window.api.org.get(),
    window.api.agent.list(),
  ]);
  const roleId = host.contextId;
  host.role = org?.roles.find((r) => r.id === roleId) || null;
  host.orgRoles = org?.roles || [];
  host.instances = roleId ? await window.api.org.listInstances(roleId) : [];
  host.allAgents = agents || [];
}
