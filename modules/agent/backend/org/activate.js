// activate.js
// Hai bước: preview (so sánh, KHÔNG tạo gì) → confirm (mới thật sự tạo agent thiếu).

const { getOrg, writeOrgData, resolveActiveOrgId } = require("./store");
const { setActiveOrgId } = require("./last-used");

function loadAgentStore() {
  try {
    return require("../agent/store.js");
  } catch {
    return null;
  }
}

function neededCount(role) {
  return role.maxCount == null ? 1 : role.maxCount;
}

function previewActivate(orgId) {
  const org = getOrg(orgId);
  if (!org) throw new Error("Org không tồn tại.");
  const missingRoles = org.roles
    .map((role) => {
      const current = org.instances.filter((i) => i.roleId === role.id).length;
      return {
        roleId: role.id,
        roleName: role.name,
        current,
        need: neededCount(role),
      };
    })
    .filter((r) => r.current < r.need);
  return {
    org: { id: org.id, name: org.name },
    isCurrentlyActive: resolveActiveOrgId() === orgId,
    missingRoles,
  };
}

function confirmActivate(orgId) {
  const org = getOrg(orgId);
  if (!org) throw new Error("Org không tồn tại.");
  const agentStore = loadAgentStore();
  if (agentStore) {
    org.roles.forEach((role) => {
      const current = org.instances.filter((i) => i.roleId === role.id);
      const need = neededCount(role);
      for (let i = current.length; i < need; i++) {
        const agent = agentStore.save({
          name: need > 1 ? `${role.name} ${i + 1}` : role.name,
          providerId: "",
          keyId: "",
          model: "",
        });
        org.instances.push({
          id: `${role.id}-${agent.id}`,
          roleId: role.id,
          agentId: agent.id,
        });
      }
    });
    writeOrgData(org);
  }
  setActiveOrgId(orgId);
  return getOrg(orgId);
}

module.exports = { previewActivate, confirmActivate };
