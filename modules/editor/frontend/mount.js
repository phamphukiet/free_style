import "./monaco-env.js";
import * as monaco from "monaco-editor";
import { readFile, writeFile } from "./bridge.js";
import { registry } from "@modules/registry.js";

function mountEditor(container) {
  const instance = monaco.editor.create(container, {
    value: "",
    theme: "vs-dark",
    fontFamily: "Consolas, 'Courier New', monospace",
    fontSize: 14,
    tabSize: 2,
    insertSpaces: true,
    automaticLayout: true,
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    cursorBlinking: "blink",
    cursorSmoothCaretAnimation: "on",
    renderWhitespace: "selection",
    wordWrap: "on",
  });
  requestAnimationFrame(() => instance.layout());
  return instance;
}

const LANGS = {
  js: "javascript",
  ts: "typescript",
  json: "json",
  html: "html",
  css: "css",
  py: "python",
  md: "markdown",
};
const detectLang = (p) =>
  LANGS[p.split(".").pop().toLowerCase()] || "plaintext";

const entries = new Map(); // path -> { model, dirty, hosts:Set }
const loading = new Map(); // path -> Promise<entry>

async function createEntry(path) {
  const model = monaco.editor.createModel(
    await readFile(path),
    detectLang(path),
  );
  const entry = { model, dirty: false, hosts: new Set() };
  model.onDidChangeContent(() => (entry.dirty = true));
  entries.set(path, entry);
  return entry;
}

async function acquireModel({ path, host }) {
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

function releaseModel({ path, host }) {
  const entry = entries.get(path);
  if (!entry) return;
  entry.hosts.delete(host);
  if (entry.hosts.size > 0) return;
  if (entry.dirty) writeFile(path, entry.model.getValue());
  entry.model.dispose();
  entries.delete(path);
}

function applyModelOptions(options) {
  entries.forEach(({ model }) => model.updateOptions(options));
}

function saveAllModels() {
  entries.forEach((entry, path) => {
    if (!entry.dirty) return;
    writeFile(path, entry.model.getValue());
    entry.dirty = false;
  });
}

registry.registerConfigConsumer("editor-save-trigger", saveAllModels);

export { mountEditor, acquireModel, releaseModel, applyModelOptions };
