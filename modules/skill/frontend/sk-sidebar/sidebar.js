import { LitElement, unsafeCSS } from "lit";
import { skSidebarTemplate } from "./sidebar.template.js";
import styles from "./sidebar.css?inline";
import sectionStyles from "./partial/section/section.css?inline";

class SkSidebarElement extends LitElement {
  static styles = [unsafeCSS(styles), unsafeCSS(sectionStyles)];
  static properties = {
    query: { state: true },
    sortBy: { state: true },
    results: { state: true },
    selectedId: { state: true },
    pinnedSkills: { state: true },
    projectSkills: { state: true },
    collapsedSections: { state: true },
    platformId: { state: true },
    platforms: { state: true },
  };

  constructor() {
    super();
    this.query = "";
    this.sortBy = "rating";
    this.platformId = "";
    this.platforms = [];
    this.results = [];
    this.selectedId = "";
    this.pinnedSkills = [];
    this.projectSkills = [];
    this.collapsedSections = {};
    this.search();
    this.loadPinned();
    this.loadProject();
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("skills:changed", this.loadAll);
    window.addEventListener("skills:platforms-changed", this.loadPlatforms);
    window.addEventListener("workbench:folder-opened", this.loadProject);
  }

  disconnectedCallback() {
    window.removeEventListener("skills:changed", this.loadAll);
    window.removeEventListener("skills:platforms-changed", this.loadPlatforms);
    window.removeEventListener("workbench:folder-opened", this.loadProject);
    super.disconnectedCallback();
  }

  loadPlatforms = async () => {
    this.platforms = await window.api.skill.platformsList();
  };

  loadAll = () => {
    this.loadPinned();
    this.loadProject();
  };

  loadPinned = async () => {
    this.pinnedSkills = await window.api.skill.listPinned();
  };

  loadProject = async () => {
    this.projectSkills = (await window.api.skill.listProject?.()) || [];
  };

  // Nguồn dữ liệu DUY NHẤT cho template — thêm nhóm mới chỉ cần thêm 1 object ở đây.
  get sections() {
    return [
      {
        id: "project",
        title: "Trong Project",
        emptyText: "Chưa cài skill nào vào project này",
        items: this.projectSkills.map((s) => ({
          id: s.id,
          label: s.name,
          meta: `v${s.version ?? "?"}`,
        })),
      },
      {
        id: "pinned",
        title: "Đã ghim",
        emptyText: "Chưa ghim skill nào",
        items: this.pinnedSkills.map((s) => ({
          id: s.id,
          label: `★ ${s.name}`,
        })),
      },
      {
        id: "results",
        title: this.query
          ? `Kết quả cho "${this.query}"${this.platformId ? ` · ${this.platforms.find((p) => p.id === this.platformId)?.name}` : ""}`
          : "Tất cả Skill",
        emptyText: "Không tìm thấy skill",
        items: this.results.map((s) => ({
          id: s.id,
          label: s.name,
          meta: `★ ${s.rating ?? "—"} · ⬇ ${s.downloads ?? "—"}`,
        })),
      },
    ];
  }

  toggleSection(id) {
    this.collapsedSections = {
      ...this.collapsedSections,
      [id]: !this.collapsedSections[id],
    };
  }

  async search() {
    this.results = await window.api.skill.search(
      this.query,
      this.sortBy,
      this.platformId || null,
    );
  }

  handleQueryInput(e) {
    this.query = e.target.value;
    clearTimeout(this._t);
    this._t = setTimeout(() => this.search(), 300);
  }

  handleSortChange(sortBy) {
    this.sortBy = sortBy;
    this.search();
  }

  handlePlatformChange(platformId) {
    this.platformId = platformId;
    this.search();
  }

  handleSelect(id) {
    this.selectedId = id;
    window.dispatchEvent(new CustomEvent("skills:select", { detail: { id } }));
  }

  render() {
    return skSidebarTemplate(this);
  }
}

customElements.define("module-sk-sidebar", SkSidebarElement);
