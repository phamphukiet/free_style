import { html } from "lit";

export function apiEditorTemplate(host) {
  return html`
    <div style="color: var(--text-normal); font-family: sans-serif;">
      <h2>Cấu hình API Key ChatGPT</h2>
      <p style="color: var(--text-muted); margin-bottom: 20px;">
        Nhập API Key của bạn để sử dụng các tính năng từ OpenAI. Key của bạn sẽ được mã hoá và lưu trữ an toàn bằng hệ thống bảo mật của hệ điều hành.
      </p>
      
      <div style="display: flex; gap: 10px; margin-bottom: 20px;">
        <input 
          type="password" 
          .value=${host.apiKey} 
          @input=${host.handleInput}
          placeholder="sk-..."
          style="flex: 1; padding: 10px; border-radius: 4px; border: 1px solid var(--bg-modifier-hover); background: var(--bg-primary); color: var(--text-normal);"
        />
      </div>

      <div style="display: flex; gap: 10px;">
        <button 
          @click=${() => host.handleSave()}
          style="padding: 10px 20px; border-radius: 4px; border: none; background: #10a37f; color: white; cursor: pointer;"
        >
          ${host.isSaved ? "Đã lưu" : "Lưu Key"}
        </button>

        ${host.isSaved ? html`
          <button 
            @click=${() => host.handleDelete()}
            style="padding: 10px 20px; border-radius: 4px; border: none; background: #d9534f; color: white; cursor: pointer;"
          >
            Xoá Key
          </button>
        ` : ""}
      </div>
    </div>
  `;
}
