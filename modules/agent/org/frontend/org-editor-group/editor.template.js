import { html } from "lit";

function dashboardTemplate(host) {
  return html`
    <div class="org-dashboard">
      <h2>Mô hình tổ chức</h2>
      ${host.org
        ? html`<p class="org-current">
            Đang dùng preset: <b>${host.org.presetId}</b>
          </p>`
        : html`<p class="org-current">
            Chưa chọn mô hình nào cho project này.
          </p>`}

      <h3>Chọn preset</h3>
      <div class="org-preset-grid">
        ${host.presets.map(
          (p) => html`
            <div
              class="org-preset-card"
              @click=${() => host.handleSelectPreset(p.id)}
            >
              <div class="org-preset-name">${p.name}</div>
              <div class="org-preset-meta">${p.id}</div>
            </div>
          `,
        )}
      </div>
      <p class="org-note">
        Chọn preset sẽ ghi đè cấu trúc org hiện tại của project.
      </p>
    </div>
  `;
}

function roleTemplate(host) {
  const role = host.role;
  return html`
    <div class="org-role-detail">
      <h2>${role.name}</h2>
      <p class="org-role-meta">
        Số lượng:
        ${host.instances.length}${role.maxCount ? ` / ${role.maxCount}` : ""}
      </p>

      <div class="org-instance-list">
        ${host.instances.map(
          (i) => html`
            <div class="org-instance-row">
              <span
                >${host.agents.find((a) => a.id === i.agentId)?.name ||
                i.agentId}</span
              >
              <button
                class="org-btn org-danger"
                @click=${() => host.handleRemoveInstance(i.id)}
              >
                Xoá
              </button>
            </div>
          `,
        )}
        ${host.instances.length === 0
          ? html`<div class="org-empty-detail">
              Chưa có agent nào cho vai trò này.
            </div>`
          : ""}
      </div>

      <button
        class="org-btn"
        ?disabled=${role.maxCount && host.instances.length >= role.maxCount}
        @click=${() => host.handleAddInstance()}
      >
        + Thêm agent
      </button>
    </div>
  `;
}

export function orgEditorTemplate(host) {
  return host.roleId && host.role
    ? roleTemplate(host)
    : dashboardTemplate(host);
}
