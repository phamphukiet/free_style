import { LitElement } from "lit";
import { editorTemplate } from "./editor.template.js";
import {
  mountEditor,
  acquireModel,
  releaseModel,
  applyModelOptions,
} from "../renderer/mount.js";
import { bindEditor } from "../renderer/effects.js";
const modelOptions = ({ tabSize, insertSpaces }) => ({ tabSize, insertSpaces });


class EditorElement extends LitElement {
  static properties = { path: { type: String }, paneId: { type: String } };

  constructor() {
    super();
    this.path = "";
    this.paneId = "";
    this.instance = null;
    this.held = new Set();
    this._options = {};
  }

  async firstUpdated() {
    const instance = await mountEditor(this.querySelector("#editor-mount"));
    if (!this.isConnected) return instance.dispose(); // bị gỡ trong lúc Monaco đang tải
    this.instance = instance;
    window.addEventListener("workbench:close-file", this.handleFileClosed);
    this._unbind = bindEditor({ host: this });
    this.showPath();
  }

  disconnectedCallback() {
    window.removeEventListener("workbench:close-file", this.handleFileClosed);
    this._unbind?.();
    this.held.forEach((path) => releaseModel({ path, host: this }));
    this.held.clear();
    this.instance?.dispose();
    super.disconnectedCallback();
  }

  handleFileClosed = (e) => {
    const { filePath, paneId } = e.detail;
    if (paneId !== this.paneId || !this.held.delete(filePath)) return;
    releaseModel({ path: filePath, host: this });
  };

  applyOptions(options) {
    this._options = options;
    this.instance?.updateOptions(options);
    applyModelOptions(modelOptions(options));
  }

  async getOrCreateModel(path) {
    const model = await acquireModel({ path, host: this });
    this.held.add(path);
    model.updateOptions(modelOptions(this._options));
    return model;
  }

  updated(changed) {
    if (changed.has("path")) this.showPath();
  }

  async showPath() {
    if (!this.path || !this.instance) return;
    const targetPath = this.path;
    const model = await this.getOrCreateModel(targetPath);
    if (this.path !== targetPath) return;
    this.instance.setModel(model);
  }

  render() {
    return editorTemplate();
  }
}

customElements.define("module-editor", EditorElement);
