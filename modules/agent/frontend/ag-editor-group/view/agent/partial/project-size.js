// project-size.js
// Dung lượng folder đang mở. Phụ thuộc tùy chọn vào module chat (chat:project-size):
// thiếu handler hoặc lỗi -> 0, không làm hỏng form agent.

export async function loadCurrentProjectBytes() {
  try {
    const state = await window.api.state.loadLastFolder();
    if (!state?.folderPath) return 0;
    return (await window.api.chat.projectSize(state.folderPath)) || 0;
  } catch {
    return 0;
  }
}
