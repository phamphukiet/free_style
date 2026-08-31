import { html } from "lit";

function childrenOf(roles, parentId) {
  return roles.filter((r) => r.parentId === parentId);
}

function roleNode(host, role) {
  const org = host.org;
  const count = (org.instances || []).filter(
    (i) => i.roleId === role.id,
  ).length;
  const children = childrenOf(org.roles, role.id);
  return html`
    <div
      class="org-item ${host.selectedRoleId === role.id ? "active" : ""}"
      @click=${() => host.handleSelectRole(role.id)}
    >
      <span class="org-item-name">${role.name}</span>
      <span class="org-item-count"
        >${count}${role.maxCount ? `/${role.maxCount}` : ""}</span
      >
    </div>
    ${children.length > 0
      ? html`<div class="org-children">
          ${children.map((c) => roleNode(host, c))}
        </div>`
      : ""}
  `;
}

export function orgSidebarTemplate(host) {
  if (!host.org) {
    return html`<div class="org-empty">Chưa chọn mô hình tổ chức</div>`;
  }
  const roots = childrenOf(host.org.roles, null);
  return html`
    <div class="org-sidebar-header"><span>${host.org.presetId}</span></div>
    <div class="org-tree">${roots.map((r) => roleNode(host, r))}</div>
  `;
}
