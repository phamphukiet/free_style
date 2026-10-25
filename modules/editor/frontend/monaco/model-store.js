import { readFile, writeFile } from "../renderer/bridge.js";
import { loadMonaco } from "./loader.js";
import { detectLang } from "./lang.js";

const entries = new Map(); // path -> { model, dirty, hosts:Set }
const loading = new Map(); // path -> Promise<entry>

async function createEntry(path) {
  const [monaco, text] = await Promise.all([loadMonaco(), readFile(path)]);
  const model = monaco.editor.createModel(text, detectLang(path));
  const entry = { model, dirty: false, hosts: new Set() };
  model.onDidChangeContent(() => (entry.dirty = true));
  entries.set(path, entry);
  return entry;
}

export async function acquireModel({ path, host }) {
  if (!entries.has(path) && !loading.has(path)) {
    loading.set(
      path,
      createEntry(path).finally(() => loading.delete(path)),
    );
  }
  const entry = entries.get(path) || (await loading.get(path));
  entry.hosts.add(host);
  return entry.model;
}

export function releaseModel({ path, host }) {
  const entry = entries.get(path);
  if (!entry) return;
  entry.hosts.delete(host);
  if (entry.hosts.size > 0) return;
  if (entry.dirty) writeFile(path, entry.model.getValue());
  entry.model.dispose();
  entries.delete(path);
}

export function applyModelOptions(options) {
  entries.forEach(({ model }) => model.updateOptions(options));
}

export const forEachEntry = (fn) => entries.forEach(fn);