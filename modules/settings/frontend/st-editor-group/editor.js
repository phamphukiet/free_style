import { LitElement, unsafeCSS } from "lit";
import { stEditorTemplate } from "./editor.template.js";
import styles from "./editor.css?inline";

class StEditorGroupElement extends LitElement {
  static styles = unsafeCSS(styles);
  static properties = {
    activeGroup: { state: true },
    allItems: { state: true },
    creating: { state: true },
    editingItem: { state: true },
  };

  constructor() {
    super();
    this.activeGroup = "";
    this.allItems = [];
    this.creating = false;
    this.editingItem = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.reload();
    window.addEventListener("settings:select-group", this.handleGroupSelect);
  }

  disconnectedCallback() {
    window.removeEventListener("settings:select-group", this.handleGroupSelect);
    super.disconnectedCallback();
  }

  handleGroupSelect = (e) => {
    this.activeGroup = e.detail.group;
    this.creating = false;
    this.editingItem = null;
  };

  handleSelectGroup(group) {
    window.dispatchEvent(
      new CustomEvent("settings:select-group", { detail: { group } }),
    );
  }

  handleBack() {
    this.activeGroup = "";
    this.creating = false;
  }

  reload = async () => {
    this.allItems = await window.api.settings.list();
  };

  async handleValueChange(item, value) {
    await window.api.settings.set(item.id, value);
    this.reload();
  }

  async handleAddPreset(item) {
    const label = window.prompt("Tên mẫu mới:");
    if (!label) return;
    const value = window.prompt("Giá trị mẫu:");
    if (value === null) return;
    await window.api.settings.addPreset(item.id, { value, label });
    this.reload();
  }

  async handleDelete(item) {
    if (!window.confirm(`Xoá setting "${item.label}"?`)) return;
    await window.api.settings.delete(item.id);
    this.reload();
  }

  handleStartCreate() {
    this.creating = true;
    this.editingItem = null;
  }

  handleEdit(item) {
    this.creating = true;
    this.editingItem = item;
  }

  handleCancelCreate() {
    this.creating = false;
    this.editingItem = null;
  }

  async handleFormSubmit() {
    const root = this.shadowRoot;
    const label = root.getElementById("st-f-label").value.trim();
    const type = root.getElementById("st-f-type").value;
    const defaultValue = root.getElementById("st-f-default").value;
    if (!label) return;

    if (this.editingItem) {
      await window.api.settings.update(this.editingItem.id, {
        label,
        type,
        default: defaultValue,
      });
    } else {
      const id = root.getElementById("st-f-id").value.trim();
      if (!id) return;
      await window.api.settings.create({
        id,
        label,
        type,
        default: defaultValue,
        group: this.activeGroup,
      });
    }
    this.creating = false;
    this.editingItem = null;
    this.reload();
  }

  render() {
    return stEditorTemplate(this);
  }
}

customElements.define("module-st-editor-group", StEditorGroupElement);
