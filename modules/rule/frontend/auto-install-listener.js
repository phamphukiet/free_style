window.addEventListener("workbench:folder-opened", async () => {
  if (!window.api?.rule?.syncPinned) return;
  const results = await window.api.rule.syncPinned();
  if (results?.length) window.dispatchEvent(new CustomEvent("rules:changed"));
});
