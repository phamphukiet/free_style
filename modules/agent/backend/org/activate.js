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

function expectedSlotNames(role) {
  const need = neededCount(role);
  if (need <= 1) return [role.name];
  return Array.from({ length: need }, (_, i) => `${role.name} ${i + 1}`);
}

function previewActivate(orgId) {
  const org = getOrg(orgId);
  if (!org) throw new Error("Org không tồn tại.");

  const agentStore = loadAgentStore();
  const localNames = new Set(
    agentStore ? agentStore.list().map((a) => a.name) : [],
  );

  const missingRoles = org.roles
    .map((role) => {
      const slots = expectedSlotNames(role);
      const current = slots.filter((name) => localNames.has(name)).length;
      return {
        roleId: role.id,
        roleName: role.name,
        current,
        need: slots.length,
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
    const localNames = new Set(agentStore.list().map((a) => a.name));
    org.roles.forEach((role) => {
      expectedSlotNames(role).forEach((name) => {
        if (localNames.has(name)) return;
        agentStore.save({ name, providerId: "", keyId: "", model: "" });
        localNames.add(name);
      });
    });
  }
  setActiveOrgId(orgId);
  return getOrg(orgId);
}

module.exports = { previewActivate, confirmActivate };
