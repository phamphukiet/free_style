// instances.js
// CRUD gán agent (instance) vào 1 vai trò trong org cụ thể.

const crypto = require("crypto");
const { getOrg, writeOrgData } = require("./store");

function addInstance(orgId, roleId, agentId) {
  const org = getOrg(orgId);
  if (!org) throw new Error("Org không tồn tại.");
  const instance = { id: crypto.randomUUID(), roleId, agentId };
  org.instances.push(instance);
  writeOrgData(org);
  return instance;
}

function removeInstance(orgId, id) {
  const org = getOrg(orgId);
  if (!org) return null;
  org.instances = org.instances.filter((i) => i.id !== id);
  return writeOrgData(org);
}

function listInstancesByRole(orgId, roleId) {
  const org = getOrg(orgId);
  if (!org) return [];
  return org.instances.filter((i) => i.roleId === roleId);
}

module.exports = { addInstance, removeInstance, listInstancesByRole };
