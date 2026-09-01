import { LitElement, unsafeCSS } from "lit";
import { agSidebarTemplate } from "./sidebar.template.js";
import styles from "./sidebar.css?inline";
import contextStyles from "./partial/sidebar-context.css?inline";
import * as agentSelection from "./partial/agent-selection.js";
import { makeHandlers } from "./partial/sidebar-handlers.js";
import orgStyles from "./partial/org/org-section.css?inline";
import { makeOrgHandlers } from "./partial/org/org-handlers.js";

class AgSidebarElement extends LitElement {
  static styles = [
    unsafeCSS(styles),
    unsafeCSS(contextStyles),
    unsafeCSS(orgStyles),
  ];
  static properties = {
    agents: { state: true },
    activeId: { state: true },
    creating: { state: true },
    editingId: { state: true },
    menuOpen: { state: true },
    menuX: { state: true },
    menuY: { state: true },
    menuTargetId: { state: true },
    org: { state: true },
    presets: { state: true },
    orgCollapsed: { state: true },
    orgCreating: { state: true },
    orgNewParentId: { state: true },
    selectedRoleId: { state: true },
    orgEditingId: { state: true },
    orgMenuOpen: { state: true },
    orgMenuX: { state: true },
    orgMenuY: { state: true },
    orgMenuTargetId: { state: true },
  };

  constructor() {
    super();
    this.agents = [];
    this.activeId = agentSelection.getSelectedAgent();
    this.creating = false;
    this.editingId = "";
    this.menuOpen = false;
    this.menuX = 0;
    this.menuY = 0;
    this.menuTargetId = "";
    // Expose agentSelection ở instance để handlers dùng được
    this._agentSelection = agentSelection;
    this._h = makeHandlers(this);

    this.org = null;
    this.presets = [];
    this.orgCollapsed = false;
    this.orgCreating = false;
    this.orgNewParentId = "manager";
    this.selectedRoleId = "";
    this.orgEditingId = "";
    this.orgMenuOpen = false;
    this.orgMenuX = 0;
    this.orgMenuY = 0;
    this.orgMenuTargetId = "";
    Object.assign(this, makeOrgHandlers(this));
  }

  connectedCallback() {
    super.connectedCallback();
    this.reload();
    window.addEventListener("agents:changed", this.reload);

    this.loadOrg();
    this.loadPresets();
    window.addEventListener("org:changed", this.loadOrg);
    window.addEventListener("workbench:folder-opened", this._onOrgFolderOpened);
  }

  disconnectedCallback() {
    window.removeEventListener("agents:changed", this.reload);
    window.removeEventListener("click", this._handleOutsideClick);
    super.disconnectedCallback();

    window.removeEventListener("org:changed", this.loadOrg);
    window.removeEventListener(
      "workbench:folder-opened",
      this._onOrgFolderOpened,
    );
    window.removeEventListener("click", this.handleOrgOutsideClick);
  }

  _onOrgFolderOpened = () => {
    this.loadOrg();
    this.loadPresets();
  };

  reload = async () => {
    this.agents = await window.api.agent.list();
  };

  _handleOutsideClick = () => {
    this.menuOpen = false;
    window.removeEventListener("click", this._handleOutsideClick);
  };

  // Delegate tất cả handlers sang sidebar-handlers.js
  handleSelect(id) {
    this._h.handleSelect(id);
  }
  startCreate() {
    return this._h.startCreate();
  }
  handleCreateConfirm(e) {
    return this._h.handleCreateConfirm(e);
  }
  handleContextMenu(e, id) {
    this._h.handleContextMenu(e, id);
  }
  handleRenameStart(id) {
    return this._h.handleRenameStart(id);
  }
  handleRenameConfirm(e, id) {
    return this._h.handleRenameConfirm(e, id);
  }
  handleRenameCancel() {
    this._h.handleRenameCancel();
  }
  handleDelete(id) {
    return this._h.handleDelete(id);
  }

  render() {
    return agSidebarTemplate(this);
  }
}

customElements.define("module-ag-sidebar", AgSidebarElement);
