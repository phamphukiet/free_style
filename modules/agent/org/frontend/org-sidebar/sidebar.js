import { LitElement, unsafeCSS } from "lit";
import { orgSidebarTemplate } from "./sidebar.template.js";
import styles from "./sidebar.css?inline";

class OrgSidebarElement extends LitElement {
  static styles = unsafeCSS(styles);
  static properties = {
    org: { state: true },
    selectedRoleId: { state: true },
  };

  constructor() {
    super();
    this.org = null;
    this.selectedRoleId = "";
  }

  connectedCallback() {
    super.connectedCallback();
    this.load();
    window.addEventListener("org:changed", this.load);
    window.addEventListener("workbench:folder-opened", this.load);
  }

  disconnectedCallback() {
    window.removeEventListener("org:changed", this.load);
    window.removeEventListener("workbench:folder-opened", this.load);
    super.disconnectedCallback();
  }

  load = async () => {
    this.org = await window.api.org.get();
  };

  handleSelectRole(roleId) {
    this.selectedRoleId = roleId;
    window.dispatchEvent(
      new CustomEvent("org:select-role", { detail: { roleId } }),
    );
  }

  render() {
    return orgSidebarTemplate(this);
  }
}

customElements.define("module-org-sidebar", OrgSidebarElement);
