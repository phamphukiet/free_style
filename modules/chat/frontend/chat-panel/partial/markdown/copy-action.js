// copy-action.js
// Copy vào clipboard và bật trạng thái "đã chép" trên nút trong thời gian ngắn.
// Trạng thái nằm ở data-state của nút nên Lit re-render không làm mất.

const RESET_MS = 1600;

export async function copyWithFeedback(button, text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error("[chat] copy lỗi:", error);
    return;
  }
  button.dataset.state = "done";
  clearTimeout(button._copyTimer);
  button._copyTimer = setTimeout(() => {
    delete button.dataset.state;
  }, RESET_MS);
}
