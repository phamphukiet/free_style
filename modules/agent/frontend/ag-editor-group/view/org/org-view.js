import { LitElement, unsafeCSS } from "lit";
import { orgViewTemplate } from "./org-view.template.js";
import ownStyles from "./org-view.css?inline";
import sharedStyles from "../shared/view-form.css?inline";
import { loadKeys } from "../shared/editor-keys.js";
import { loadRoleDetail } from "./partial/role-loader.js";
import { makeRoleHandlers } from "./partial/role-handlers.js";

class OrgViewElement extends LitElement {
  static styles = [unsafeCSS(sharedStyles), unsafeCSS(ownStyles)];
  static properties = {
    contextId: { type: String }, // roleId, do editor.js truyền vào
    role: { state: true },
    orgRoles: { state: true },
    instances: { state: true },
    allAgents: { state: true },
    keys: { state: true },
    addingInstance: { state: true },
    newInstanceName: { state: true },
    newInstanceKeyRef: { state: true },
    newInstanceModels: { state: true },
    newInstanceModel: { state: true },
  };

  constructor() {
    super();
    this.contextId = "";
    this.role = null;
    this.orgRoles = [];
    this.instances = [];
    this.allAgents = [];
    this.keys = [];
    this.addingInstance = false;
    this.newInstanceName = "";
    this.newInstanceKeyRef = "";
    this.newInstanceModels = [];
    this.newInstanceModel = "";
    this._requestToken = 0;
    this._loadedFor = "";
    this._roleH = makeRoleHandlers(this);
  }

  connectedCallback() {
    super.connectedCallback();
    loadKeys().then((keys) => (this.keys = keys));
    window.addEventListener("org:changed", this.handleOrgChanged);
  }

  disconnectedCallback() {
    window.removeEventListener("org:changed", this.handleOrgChanged);
    super.disconnectedCallback();
  }

  willUpdate(changed) {
    if (changed.has("contextId") && this.contextId !== this._loadedFor) {
      this._loadedFor = this.contextId;
      loadRoleDetail(this);
    }
  }

  handleOrgChanged = () => {
    if (this.contextId) loadRoleDetail(this);
  };

  render() {
    return orgViewTemplate(this);
  }
}

customElements.define("ag-view-org", OrgViewElement);
