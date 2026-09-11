window.addEventListener("workbench:folder-opened", async () => {
  if (!window.api?.workflow?.syncPinned) return;
  const results = await window.api.workflow.syncPinned();
  if (results?.length)
    window.dispatchEvent(new CustomEvent("workflows:changed"));
});
