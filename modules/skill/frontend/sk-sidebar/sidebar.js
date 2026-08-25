import { LitElement, unsafeCSS } from "lit";
import { skSidebarTemplate } from "./sidebar.template.js";
import styles from "./sidebar.css?inline";
import { getSidebarHandlers } from "./sidebar-handlers.js";

const partialStyles = import.meta.glob("./partial/**/*.css", { eager: true, query: "?inline", import: "default" });

class SkSidebarElement extends LitElement {
  static styles = [unsafeCSS(styles), ...Object.values(partialStyles).map(s => unsafeCSS(s))];
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

    Object.assign(this, getSidebarHandlers(this));

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

  render() {
    return skSidebarTemplate(this);
  }
}

customElements.define("module-sk-sidebar", SkSidebarElement);
