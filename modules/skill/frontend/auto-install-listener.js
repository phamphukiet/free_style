window.addEventListener("workbench:folder-opened", async () => {
  if (!window.api?.skill?.syncPinned) return;
  const results = await window.api.skill.syncPinned();
  if (results?.length) window.dispatchEvent(new CustomEvent("skills:changed"));
});
