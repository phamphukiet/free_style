import { registry } from "@modules/registry.js";
import { writeFile } from "../renderer/bridge.js";
import { forEachEntry } from "./model-store.js";

function saveAllModels() {
  forEachEntry((entry, path) => {
    if (!entry.dirty) return;
    writeFile(path, entry.model.getValue());
    entry.dirty = false;
  });
}

registry.registerConfigConsumer("editor-save-trigger", saveAllModels);