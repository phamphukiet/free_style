import { html } from "lit";

export function geminiKeyCreatorTemplate(host) {
  return html`
    <div
      style="color: var(--text-normal); font-family: sans-serif; max-width: 500px;"
    >
      <h2>Thêm API Key - Google Gemini</h2>
      <p style="color: var(--text-muted); margin-bottom: 20px;">
        Nhập API Key của Google AI Studio để bắt đầu sử dụng. Key sẽ được kiểm
        tra kết nối trước khi lưu.
      </p>

      <div
        style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px;"
      >
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <label style="font-size: 14px; font-weight: 500;">Tên gợi nhớ</label>
          <input
            type="text"
            .value=${host.keyName}
            @input=${host.handleNameInput}
            ?disabled=${host.isValidating}
            style="padding: 8px 12px; border-radius: 4px; border: 1px solid var(--bg-modifier-hover); background: var(--bg-primary); color: var(--text-normal);"
          />
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          <label style="font-size: 14px; font-weight: 500;"
            >API Key (AIza...)</label
          >
          <input
            type="password"
            .value=${host.keyValue}
            @input=${host.handleKeyInput}
            ?disabled=${host.isValidating}
            placeholder="AIza..."
            style="padding: 8px 12px; border-radius: 4px; border: 1px solid var(--bg-modifier-hover); background: var(--bg-primary); color: var(--text-normal);"
          />
        </div>
      </div>

      ${host.statusMessage
        ? html`
            <div
              style="margin-bottom: 20px; padding: 12px; border-radius: 4px; font-size: 14px;
          ${host.statusType === "error"
                ? "background: rgba(217, 83, 79, 0.1); color: #d9534f; border: 1px solid rgba(217, 83, 79, 0.2);"
                : ""}
          ${host.statusType === "success"
                ? "background: rgba(92, 184, 92, 0.1); color: #5cb85c; border: 1px solid rgba(92, 184, 92, 0.2);"
                : ""}
          ${host.statusType === ""
                ? "background: var(--bg-modifier-hover); color: var(--text-normal);"
                : ""}
        "
            >
              ${host.statusMessage}
            </div>
          `
        : ""}

      <div style="display: flex; gap: 12px;">
        <button
          @click=${() => host.handleSave()}
          ?disabled=${host.isValidating}
          style="padding: 8px 16px; border-radius: 4px; border: none; background: #4285f4; color: white; cursor: pointer; font-weight: 500;"
        >
          ${host.isValidating ? "Đang xử lý..." : "Lưu & Kiểm tra"}
        </button>
        <button
          @click=${() => host.handleCancel()}
          ?disabled=${host.isValidating}
          style="padding: 8px 16px; border-radius: 4px; border: 1px solid var(--bg-modifier-hover); background: transparent; color: var(--text-normal); cursor: pointer;"
        >
          Huỷ
        </button>
      </div>
    </div>
  `;
}
