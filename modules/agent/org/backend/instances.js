// instances.js
// Gán agent thật (agents.json) vào 1 role — instance lưu trong org.json.

const crypto = require("crypto");
const { readOrg, writeOrg } = require("./store");

function addInstance(roleId, agentId) {
  const org = readOrg();
  if (!org) throw new Error("Chưa chọn mô hình tổ chức.");
  const instance = { id: crypto.randomUUID(), roleId, agentId };
  org.instances = [...(org.instances || []), instance];
  writeOrg(org);
  return instance;
}

function removeInstance(instanceId) {
  const org = readOrg();
  if (!org) return false;
  org.instances = (org.instances || []).filter((i) => i.id !== instanceId);
  writeOrg(org);
  return true;
}

function listInstancesByRole(roleId) {
  const org = readOrg();
  if (!org) return [];
  return (org.instances || []).filter((i) => i.roleId === roleId);
}

module.exports = { addInstance, removeInstance, listInstancesByRole };