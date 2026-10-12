// modules/runner/frontend/run-handler.js
// Trách nhiệm duy nhất: nhận "runner:run", hỏi backend, rồi chuyển trạng thái thành hành động.
import { registry } from "@modules/registry.js";

const emit = (name, detail) =>
  window.dispatchEvent(new CustomEvent(name, { detail }));
const toast = (message) => emit("workbench:toast", { message });

const HANDLERS = {
  ready: (info) => {
    emit("workbench:panel-show");
    emit("terminal:execute", { exe: info.exe, args: info.args });
  },
  "needs-setup": (info) => emit("runner:need-setup", info),
  manual: (info) =>
    toast(
      `${info.label} chưa có và chưa hỗ trợ tự cài trên hệ điều hành này — hãy cài thủ công.`,
    ),
  unsupported: () => toast("Chưa hỗ trợ chạy loại file này."),
};
const fallback = (info) => toast(`Chế độ "${info.status}" chưa được hỗ trợ.`);

async function handleRun(e) {
  const { filePath } = e.detail;
  if (!filePath) return toast("Chưa mở file nào để chạy.");
  if (!registry.getPanelView())
    return toast("Cần module terminal để xem kết quả chạy.");

  // Editor đã đăng ký "editor-save-trigger" ở configConsumers: ghi file đang sửa dở xuống đĩa.
  registry.getConfigConsumers().forEach((save) => save());

  const info = await window.api.runner.resolve(filePath);
  (HANDLERS[info.status] || fallback)(info);
}

window.addEventListener("runner:run", handleRun);
