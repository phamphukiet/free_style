import { registry } from "@modules/registry.js";
import { writeFile } from "../renderer/bridge.js";
import { forEachEntry } from "./model-store.js";
import { registerCommandHandler } from "@shared/command/renderer/client.js";

async function saveAllModels() {
  const jobs = [];
  forEachEntry((entry, path) => {
    if (!entry.dirty) return;
    entry.dirty = false;
    jobs.push(
      writeFile(path, entry.model.getValue()).then((ok) => {
        if (!ok) entry.dirty = true; // ghi lỗi: giữ trạng thái chưa lưu
        return ok;
      }),
    );
  });
  return (await Promise.all(jobs)).filter(Boolean).length;
}

registry.registerConfigConsumer("editor-save-trigger", saveAllModels);
registerCommandHandler({
  id: "editor.saveAll",
  handler: async () => {
    const saved = await saveAllModels();
    return { message: `Đã lưu ${saved} file.`, saved };
  },
});