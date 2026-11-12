// run-action.js
// Nút ▶ trên toolbar editor: chạy ext tương ứng với file đang mở.

import { registry } from "@modules/registry.js";
import { listExtensions } from "./ext-bridge.js";
import { startExtension, attempt, toast } from "./ext-actions.js";

const EVENT = "extension:run-active";
const norm = (path) =>
  String(path ?? "")
    .replace(/\\/g, "/")
    .toLowerCase();

registry.registerEditorAction({
  title: "Chạy extension (file đang mở)",
  glyph: "▶",
  event: EVENT,
});

window.addEventListener(EVENT, (e) =>
  attempt(async () => {
    const items = await listExtensions();
    const target = items.find((i) => norm(i.file) === norm(e.detail.filePath));
    if (!target) return toast("File đang mở không phải code của extension");
    await startExtension(target);
    toast(`Đã chạy "${target.name}"`);
  }),
);
