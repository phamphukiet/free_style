// last-used.js
const { readState, writeState } = require("../../../../src/main/state");

function getActiveOrgId() {
  return readState().activeOrgId || null;
}
function setActiveOrgId(orgId) {
  if (getActiveOrgId() === orgId) return;
  writeState({ activeOrgId: orgId });
}
module.exports = { getActiveOrgId, setActiveOrgId };
