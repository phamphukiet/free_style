// ai-notify-listener.js
function describe(info) {
  if (info.action === "create") return `Đã tạo rule mới: ${info.name}`;
  if (info.action === "update") return `Đã cập nhật rule: ${info.name}`;
  if (info.action === "delete") return `Đã xoá rule (id: ${info.deleted})`;
  return "Rule đã thay đổi";
}

window.api.rule.onAiChanged?.((info) => {
  window.dispatchEvent(new CustomEvent("rules:changed"));
  window.dispatchEvent(
    new CustomEvent("workbench:toast", { detail: { message: describe(info) } }),
  );
});
