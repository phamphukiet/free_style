import { LitElement, unsafeCSS } from "lit";
import { skEditorTemplate } from "./editor.template.js";
import styles from "./editor.css?inline";
import { getEditorHandlers } from "./editor-handlers.js";
import { getSearchHandlers } from "./partial/search/search-handlers.js";

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

    Object.assign(this, getEditorHandlers(this), getSearchHandlers(this));
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
    super.disconnectedCallback();
  }

  render() {
    return skEditorTemplate(this);
  }
}

customElements.define("module-sk-editor-group", SkEditorGroupElement);
