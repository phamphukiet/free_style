import { html } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import plusIcon from "lucide-static/icons/plus.svg?raw";
import saveIcon from "lucide-static/icons/save.svg?raw";
import { presetSwitchTemplate } from "./partial/preset-switch.template.js";
import { createRow } from "./partial/create-row.template.js";
import { roleTree } from "./partial/role-tree.template.js";
import { sampleListTemplate } from "./partial/sample-list.template.js";

export function orgGroupTemplate(host) {
  return html`
    <div class="ag-sidebar-header org-header">
      <span class="ag-sidebar-title" @click=${() => host.toggleOrgSection()}
        >Org</span
      >
      ${host.org && host.org.presetId !== "solo"
        ? html`<button
            class="icon-btn"
            title="Thêm vai trò"
            @click=${() => host.startCreateRole()}
          >
            ${unsafeSVG(plusIcon)}
          </button>`
        : ""}
      ${host.org && host.org.presetId !== "solo" && !host.orgSavingPreset
        ? html`<button
            class="icon-btn"
            title="Đăng ký org mới"
            @click=${() => host.startSavePreset()}
          >
            ${unsafeSVG(saveIcon)}
          </button>`
        : ""}
      ${host.orgSavingPreset
        ? html`<input
            class="rename-input"
            placeholder="Tên org (để trống = tự đặt)"
            @blur=${(e) => host.handleSavePresetConfirm(e)}
            @keydown=${(e) => e.key === "Enter" && e.target.blur()}
          />`
        : ""}
    </div>
    ${!host.orgCollapsed
      ? html`
          <div class="ag-sidebar-list org-list">
            ${!host.org
              ? sampleListTemplate(host)
              : html`${presetSwitchTemplate(host)}${createRow(host)}${roleTree(
                  host,
                  host.org.roles,
                  null,
                )}`}
          </div>
        `
      : ""}
    ${host.orgMenuOpen
      ? html`
          <div
            class="ag-context-menu"
            style="left:${host.orgMenuX}px;top:${host.orgMenuY}px"
          >
            <button
              class="menu-item"
              @click=${() => host.handleRoleRenameStart(host.orgMenuTargetId)}
            >
              Rename
            </button>
            <button
              class="menu-item"
              @click=${() => host.handleRoleDelete(host.orgMenuTargetId)}
            >
              Delete
            </button>
          </div>
        `
      : ""}
  `;
}
