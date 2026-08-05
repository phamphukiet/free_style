import { html } from "lit";
import copyIcon from "lucide-static/icons/copy.svg?raw";
import checkIcon from "lucide-static/icons/check.svg?raw";

export function apiKeyEditorTemplate(host) {
  if (!host.keyObj) return html`<div>Đang tải...</div>`;

  return html`
    <div style="color: var(--text-normal); font-family: sans-serif; max-width: 500px;">
      <h2>Chỉnh sửa API Key</h2>
      
      <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 20px; margin-bottom: 24px;">
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <label style="font-size: 14px; font-weight: 500;">Tên gợi nhớ</label>
          <input 
            type="text" 
            .value=${host.editName}
            @input=${host.handleNameInput}
            style="padding: 8px 12px; border-radius: 4px; border: 1px solid var(--bg-modifier-hover); background: var(--bg-primary); color: var(--text-normal);"
          />
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          <label style="font-size: 14px; font-weight: 500;">Key / Email (Chỉ đọc)</label>
          <div style="display: flex; gap: 8px;">
            <input 
              type="text" 
              .value=${host.keyObj.value}
              readonly
              style="flex-grow: 1; padding: 8px 12px; border-radius: 4px; border: 1px solid var(--bg-modifier-hover); background: var(--bg-modifier-hover); color: var(--text-muted); cursor: default;"
            />
            <button 
              @click=${() => host.handleCopy()}
              style="padding: 0 12px; border-radius: 4px; border: 1px solid var(--bg-modifier-hover); background: var(--bg-primary); color: var(--text-normal); cursor: pointer; display: flex; align-items: center; justify-content: center; min-width: 40px;"
              title="Copy"
            >
              ${host.copyStatus ? html`
                <div style="width: 16px; height: 16px; color: #5cb85c;" .innerHTML=${checkIcon}></div>
              ` : html`
                <div style="width: 16px; height: 16px;" .innerHTML=${copyIcon}></div>
              `}
            </button>
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 12px;">
        <button 
          @click=${() => host.handleSave()}
          style="padding: 8px 16px; border-radius: 4px; border: none; background: #007acc; color: white; cursor: pointer; font-weight: 500;"
        >
          Lưu thay đổi
        </button>
        <button 
          @click=${() => host.handleCancel()}
          style="padding: 8px 16px; border-radius: 4px; border: 1px solid var(--bg-modifier-hover); background: transparent; color: var(--text-normal); cursor: pointer;"
        >
          Trở lại
        </button>
      </div>
    </div>
  `;
}
