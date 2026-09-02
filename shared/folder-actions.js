// Cầu nối tạm giữa titlebar và sidebar bằng CustomEvent.
// Giai đoạn 3 sẽ thay bằng registry.get('sidebar').setFolder(...).

export async function openFolder() {
  const result = await window.api.dialog.openFolder();
  if (!result) return; // người dùng bấm Cancel
  window.dispatchEvent(
    new CustomEvent("workbench:folder-opened", { detail: result }),
  );
}

export async function loadLastFolder() {
  const result = await window.api.state.loadLastFolder();
  if (result) {
    window.dispatchEvent(
      new CustomEvent("workbench:folder-opened", { detail: result }),
    );
  }
  return result;
}