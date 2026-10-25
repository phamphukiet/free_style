// Renderer: mở/khôi phục project, rồi báo cho sidebar qua CustomEvent.
function announce(result) {
  window.dispatchEvent(
    new CustomEvent("workbench:folder-opened", { detail: result }),
  );
}

export async function openFolder() {
  const result = await window.api.dialog.openFolder();
  if (result) announce(result);
  return result;
}

export async function loadLastFolder() {
  const result = await window.api.state.loadLastFolder();
  if (result) announce(result);
  return result;
}