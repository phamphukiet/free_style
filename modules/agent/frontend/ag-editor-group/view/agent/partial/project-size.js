// project-size.js
// Trách nhiệm duy nhất: lấy dung lượng folder đang mở, dùng chung cho editor.js.

export async function loadCurrentProjectBytes() {
  const state = await window.api.state.loadLastFolder();
  if (!state?.folderPath) return 0;
  return (await window.api.chat.projectSize(state.folderPath)) || 0;
}