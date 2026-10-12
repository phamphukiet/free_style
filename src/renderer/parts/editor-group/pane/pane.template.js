import { html, unsafeStatic } from "lit/static-html.js";
import { registry } from "@modules/registry.js";

function toolbar(host) {
  const actions = registry
    .getEditorActions()
    .map(
      (a) => html`
        <button
          class="pane-btn"
          title=${a.title}
          @click=${() => host.handleAction(a)}
        >
          ${a.glyph}
        </button>
      `,
    );
  return html`
    <div class="pane-toolbar">
      ${actions}
      <button
        class="pane-btn"
        title="Chia đôi màn hình"
        @click=${() => host.handleSplit()}
      >
        ⊞
      </button>
      <button
        class="pane-btn"
        title="Đóng pane"
        @click=${() => host.handleClose()}
      >
        ×
      </button>
    </div>
  `;
}

export function paneTemplate(host, emptyTagName) {
  const body =
    host.activeModuleId !== "explorer" || host.openFiles.length === 0
      ? emptyTagName
        ? html`<div class="editor-dynamic-view"><${unsafeStatic(emptyTagName)}></${unsafeStatic(emptyTagName)}></div>`
        : html`<div class="editor-empty">Chưa có nội dung</div>`
      : html`
          <div class="editor-tab-bar">
            ${host.openFiles.map(
              (file) => html`
                <div
                  class="editor-tab ${file.path === host.activePath
                    ? "active"
                    : ""}"
                  @click=${() => host.handleSelectTab(file.path)}
                >
                  <span class="tab-label">${file.name}</span>
                  <button
                    class="tab-close-btn"
                    @click=${(e) => {
                      e.stopPropagation();
                      host.handleCloseFile(file.path);
                    }}
                  >
                    &times;
                  </button>
                </div>
              `,
            )}
          </div>
          <div class="editor-container">
            <module-editor .path=${host.activePath}></module-editor>
          </div>
        `;

  return html`
    <div
      class="pane-root ${host.isActive ? "pane-active" : ""}"
      @mousedown=${() => host.handleFocus()}
    >
      ${toolbar(host)} ${body}
    </div>
  `;
}
