import { LitElement, unsafeCSS } from "lit";
import { agSidebarTemplate } from "./sidebar.template.js";
import styles from "./sidebar.css?inline";
import { setSelectedAgent, getSelectedAgent } from "../agent-selection.js";

class AgSidebarElement extends LitElement {
  static styles = unsafeCSS(styles);
  static properties = {
    agents: { state: true },
    activeId: { state: true },
    creating: { state: true },
    editingId: { state: true },
    menuOpen: { state: true },
    menuX: { state: true },
    menuY: { state: true },
    menuTargetId: { state: true },
  };

  constructor() {
    super();
    this.agents = [];
    this.activeId = "";
    this.creating = false;
    this.editingId = "";
    this.menuOpen = false;
    this.menuX = 0;
    this.menuY = 0;
    this.menuTargetId = "";
    this.activeId = getSelectedAgent();
  }

  connectedCallback() {
    super.connectedCallback();
    this.reload();
    window.addEventListener("agents:changed", this.reload);
  }

  disconnectedCallback() {
    window.removeEventListener("agents:changed", this.reload);
    window.removeEventListener("click", this.handleOutsideClick);
    super.disconnectedCallback();
  }

  reload = async () => {
    this.agents = await window.api.agent.list();
  };

  handleSelect(id) {
    this.activeId = id;
    setSelectedAgent(id);
  }

  async startCreate() {
    this.creating = true;
    await this.updateComplete;
    this.shadowRoot.querySelector(".create-input")?.focus();
  }

  handleCreateConfirm = async (e) => {
    if (!this.creating) return;
    const name = e.target.value.trim();
    this.creating = false;
    if (!name) return;
    const created = await window.api.agent.save({ name });
    window.dispatchEvent(new CustomEvent("agents:changed"));
    this.handleSelect(created.id);
  };

  handleContextMenu(e, id) {
    e.preventDefault();
    e.stopPropagation();
    this.menuX = e.clientX;
    this.menuY = e.clientY;
    this.menuTargetId = id;
    this.menuOpen = true;
    setTimeout(
      () => window.addEventListener("click", this.handleOutsideClick),
      0,
    );
  }

  handleOutsideClick = () => {
    this.menuOpen = false;
    window.removeEventListener("click", this.handleOutsideClick);
  };

  async handleRenameStart(id) {
    this.menuOpen = false;
    this.editingId = id;
    await this.updateComplete;
    const input = this.shadowRoot.querySelector(".rename-input");
    input?.focus();
    input?.select();
  }

  handleRenameConfirm = async (e, id) => {
    const name = e.target.value.trim();
    this.editingId = "";
    const current = this.agents.find((a) => a.id === id);
    if (name && name !== current?.name) {
      await window.api.agent.save({ id, name });
      window.dispatchEvent(new CustomEvent("agents:changed"));
    }
  };

  handleRenameCancel() {
    this.editingId = "";
  }

  async handleDelete(id) {
    this.menuOpen = false;
    if (id === "manager") {
      alert("Không thể xoá agent mặc định.");
      return;
    }
    if (!window.confirm("Xoá agent này?")) return;
    await window.api.agent.delete(id);
    if (this.activeId === id) {
      this.activeId = "";
      setSelectedAgent("");
    }
    window.dispatchEvent(new CustomEvent("agents:changed"));
  }

  render() {
    return agSidebarTemplate(this);
  }
}

customElements.define("module-ag-sidebar", AgSidebarElement);
