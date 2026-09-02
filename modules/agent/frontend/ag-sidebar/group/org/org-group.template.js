import { html } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import plusIcon from "lucide-static/icons/plus.svg?raw";
import saveIcon from "lucide-static/icons/save.svg?raw";
import { presetSwitchTemplate } from "./preset-switch.template.js";

function childrenOf(roles, parentId) {
  return roles.filter((r) => r.parentId === parentId);
}

function roleRow(host, role) {
  const nameBlock =
    host.orgEditingId === role.id
      ? html`<input
          class="rename-input org-rename-input"
          .value=${role.name}
          @blur=${(e) => host.handleRoleRenameConfirm(e, role.id)}
          @keydown=${(e) => {
            if (e.key === "Enter") e.target.blur();
            if (e.key === "Escape") {
              e.stopPropagation();
              host.handleRoleRenameCancel();
            }
          }}
        />`
      : html`<span class="ag-item-name">${role.name}</span>`;

  return html`
    <div
      class=${classMap({
        "ag-item": true,
        active: host.selectedRoleId === role.id,
      })}
      @click=${() => host.handleSelectRole(role.id)}
      @contextmenu=${(e) => host.handleRoleContextMenu(e, role.id)}
    >
      ${nameBlock}
    </div>
  `;
}

function roleTree(host, roles, parentId, depth = 0) {
  return childrenOf(roles, parentId).map(
    (r) => html`
      <div style="padding-left:${depth * 14}px">${roleRow(host, r)}</div>
      ${roleTree(host, roles, r.id, depth + 1)}
    `,
  );
}

function createRow(host) {
  if (!host.orgCreating) return html``;
  const parents = host.org?.roles || [];
  return html`
    <div class="ag-item org-create-row">
      <select
        class="org-parent-select"
        .value=${host.orgNewParentId ?? ""}
        @change=${(e) => host.setNewRoleParent(e.target.value)}
      >
        <option value="">-- Không có cha --</option>
        ${parents.map((r) => html`<option value=${r.id}>${r.name}</option>`)}
      </select>
      <input
        class="rename-input create-input"
        placeholder="Tên vai trò"
        @blur=${(e) => host.handleCreateRoleConfirm(e)}
        @keydown=${(e) => {
          if (e.key === "Enter") e.target.blur();
          if (e.key === "Escape") {
            e.stopPropagation();
            host.cancelCreateRole();
          }
        }}
      />
    </div>
  `;
}

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

function sampleListTemplate(host) {
  const sorted = [...host.presets].sort((a, b) =>
    (a.id === host.lastUsedPresetId ? -1 : 0) - (b.id === host.lastUsedPresetId ? -1 : 0),
  );
  return html`
    <div class="org-empty-hint">Chưa mở project — mẫu tổ chức tham khảo:</div>
    ${sorted.map(
      (p) => html`
        <div class="ag-item ${p.id === host.lastUsedPresetId ? "active" : ""}">
          <span class="ag-item-name">${p.name}</span>
          ${p.id === host.lastUsedPresetId ? html`<span class="org-badge">Đang dùng</span>` : ""}
        </div>
      `,
    )}
  `;
}
