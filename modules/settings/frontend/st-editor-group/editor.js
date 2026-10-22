import { LitElement, unsafeCSS } from "lit";
import { stEditorTemplate } from "./editor.template.js";
import styles from "./editor.css?inline";

const toast = (message) =>
  window.dispatchEvent(
    new CustomEvent("workbench:toast", { detail: { message } }),
  );

const slug = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

class StEditorGroupElement extends LitElement {
  static styles = unsafeCSS(styles);
  static properties = {
    activeGroup: { state: true },
    allItems: { state: true },
    presetTarget: { state: true },
  };

  constructor() {
    super();
    this.activeGroup = "";
    this.allItems = [];
    this.presetTarget = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.reload();
    window.addEventListener("settings:select-group", this.handleGroupSelect);
    this._off = window.api.settings.onChanged(this.reload);
  }

  disconnectedCallback() {
    window.removeEventListener("settings:select-group", this.handleGroupSelect);
    this._off?.();
    super.disconnectedCallback();
  }

  handleGroupSelect = (e) => {
    this.activeGroup = e.detail.group;
    this.presetTarget = null;
  };

  handleSelectGroup(group) {
    window.dispatchEvent(
      new CustomEvent("settings:select-group", { detail: { group } }),
    );
  }

  handleBack() {
    this.activeGroup = "";
    this.presetTarget = null;
  }

  reload = async () => {
    this.allItems = await window.api.settings.list();
  };

  async run(task) {
    try {
      await task();
    } catch (error) {
      toast(error.message);
    }
  }

  handleValueChange(item, value) {
    return this.run(() => window.api.settings.set({ id: item.id, value }));
  }

  handleReset(item) {
    return this.run(() => window.api.settings.reset({ id: item.id }));
  }

  handleStartPreset(item) {
    this.presetTarget = item;
  }

  handleCancelPreset() {
    this.presetTarget = null;
  }

  handlePresetSubmit() {
    const root = this.shadowRoot;
    const label = root.getElementById("st-p-label").value.trim();
    const raw = root.getElementById("st-p-data").value.trim();
    return this.run(async () => {
      const option = {
        value: slug(label),
        label,
        data: JSON.parse(raw || "{}"),
      };
      await window.api.settings.addPreset({ id: this.presetTarget.id, option });
      this.presetTarget = null;
      await this.reload();
    });
  }

  handleImportVscode() {
    return this.run(async () => {
      const report = await window.api.settings.importVscode({});
      toast(`Đã nhập ${report.applied.length} setting từ VS Code`);
    });
  }

  render() {
    return stEditorTemplate(this);
  }
}

customElements.define("module-st-editor-group", StEditorGroupElement);
