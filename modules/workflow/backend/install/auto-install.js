// auto-install.js
// Tự cài workflow "pinned" nào chưa có trong project — giống rule/skill.

const workflowStore = require("../catalog/workflow-store");
const { installWorkflow, listInstalled } = require("./install");

function syncPinnedWorkflows() {
  const pinned = workflowStore.listPinned();
  const installed = listInstalled();
  const results = [];
  for (const workflow of pinned) {
    if (installed[workflow.id]) continue;
    try {
      installWorkflow(workflow);
      results.push({ id: workflow.id, installed: true });
    } catch (error) {
      results.push({
        id: workflow.id,
        installed: false,
        message: error.message,
      });
    }
  }
  return results;
}

module.exports = { syncPinnedWorkflows };
