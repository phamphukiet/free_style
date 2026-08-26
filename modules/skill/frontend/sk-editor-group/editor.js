import { LitElement, unsafeCSS } from "lit";
import { skEditorTemplate } from "./editor.template.js";
import styles from "./editor.css?inline";
import { getEditorHandlers } from "./editor-handlers.js";
import { getSearchHandlers } from "./partial/search/search-handlers.js";
import { getPlatformHandlers } from "./partial/platform/platform-handlers.js";
import { getImportLinkHandlers } from "./partial/import-link/import-link-handlers.js";

class SkEditorGroupElement extends LitElement {
  static styles = unsafeCSS(styles);
  static properties = {
    openTabs: { state: true },
    activeSkillId: { state: true },
    skill: { state: true },
    agents: { state: true },
    checkedAgentIds: { state: true },
    installing: { state: true },
    showInstallForm: { state: true },
    answers: { state: true },
    pinnedSkills: { state: true },
    query: { state: true },
    sortBy: { state: true },
    platformId: { state: true },
    platforms: { state: true },
    results: { state: true },
    addingPlatform: { state: true },
    addLinkUrl: { state: true },
    addLinkStatus: { state: true },
    addLinkLoading: { state: true },
    platformDropdownOpen: { state: true },
    editingPlatformId: { state: true },
    importLinkUrl: { state: true },
    importLinkLoading: { state: true },
    importLinkStatus: { state: true },
  };

  constructor() {
    super();
    this.openTabs = [];
    this.activeSkillId = "";
    this.skill = null;
    this.agents = [];
    this.checkedAgentIds = [];
    this.installing = false;
    this.showInstallForm = false;
    this.answers = {};
    this.pinnedSkills = [];
    this.query = "";
    this.sortBy = "rating";
    this.platformId = "";
    this.platforms = [];
    this.results = [];
    this.addingPlatform = false;
    this.addLinkUrl = "";
    this.addLinkStatus = "";
    this.addLinkLoading = false;
    this.platformDropdownOpen = false;
    this.importLinkUrl = "";
    this.importLinkLoading = false;
    this.importLinkStatus = "";
    Object.assign(
      this,
      getEditorHandlers(this),
      getSearchHandlers(this),
      getImportLinkHandlers(this),
    );
    this.editingPlatformId = "";
    this._closePlatformDropdown = () => {
      this.platformDropdownOpen = false;
      this.editingPlatformId = "";
      window.removeEventListener("click", this._closePlatformDropdown);
    };
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("skills:select", this.handleSelect);
    window.addEventListener("skills:changed", this.loadPinned);
    import("./partial/agents-optional.js")
      .then((m) =>
        m.loadAgentsOptional().then((agents) => (this.agents = agents)),
      )
      .catch(() => {});
    this.loadPinned();
    this.loadPlatforms();
    this.search();
  }

  disconnectedCallback() {
    window.removeEventListener("skills:select", this.handleSelect);
    window.removeEventListener("skills:changed", this.loadPinned);
    window.removeEventListener("click", this._closePlatformDropdown);
    super.disconnectedCallback();
  }

  render() {
    return skEditorTemplate(this);
  }
}

customElements.define("module-sk-editor-group", SkEditorGroupElement);
