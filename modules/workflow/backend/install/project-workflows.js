// project-workflows.js
// Ghép manifest (install.js — chỉ có tên file) với catalog (workflow-store.js
// — có tên hiển thị) để sidebar hiển thị được tên workflow trong project.

const { listInstalled } = require("./install");
const workflowStore = require("../catalog/workflow-store");

function listProjectWorkflows() {
  const manifest = listInstalled();
  return Object.entries(manifest).map(([id, info]) => {
    const workflow = workflowStore.get(id);
    return {
      id,
      name: workflow?.name || id,
      installedAt: info.installedAt,
    };
  });
}

module.exports = { listProjectWorkflows };