// Điểm DUY NHẤT nạp Monaco: env (worker) trước, rồi monaco-editor, chỉ 1 lần.
let pending = null;

export function loadMonaco() {
  pending ??= import("./env.js").then(() => import("monaco-editor"));
  return pending;
}