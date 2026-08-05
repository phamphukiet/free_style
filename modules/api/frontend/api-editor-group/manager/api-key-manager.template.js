import { html as litHtml } from "lit";
import { html, unsafeStatic } from "lit/static-html.js";
import keyIcon from "lucide-static/icons/key.svg?raw";
import trashIcon from "lucide-static/icons/trash-2.svg?raw";
import editIcon from "lucide-static/icons/pencil.svg?raw";
import { registry } from "../../../../registry.js";

export function apiKeyManagerTemplate(host) {
  if (host.isCreating) {
    const creatorTagName = registry.getProviderCreatorView(host.providerId);
    if (creatorTagName) {
      const tag = unsafeStatic(creatorTagName);
      return html`
        <${tag}
          .providerId=${host.providerId}
          @cancel=${() => host.handleCancelCreate()}
          @created=${() => host.handleKeyCreated()}
        ></${tag}>
      `;
    }
  }

  return litHtml`
    <div style="color: var(--text-normal); font-family: sans-serif;">
      <h2>Quản lý API Keys - ${host.providerId.toUpperCase()}</h2>
      <p style="color: var(--text-muted); margin-bottom: 20px;">
        Các API Key được lưu trữ an toàn. Bạn có thể thêm, sửa, hoặc xoá chúng.
      </p>
      
      <div style="margin-bottom: 20px;">
        <button 
          @click=${() => host.handleCreate()}
          style="padding: 10px 20px; border-radius: 4px; border: none; background: var(--bg-modifier-hover); color: var(--text-normal); cursor: pointer; display: flex; align-items: center; gap: 8px;"
        >
          Thêm Key mới
        </button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${host.keys.map(
          (k) => litHtml`
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--bg-primary); border: 1px solid var(--bg-modifier-hover); border-radius: 6px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 20px; height: 20px; color: var(--text-muted);" .innerHTML=${keyIcon}></div>
              <div>
                <div style="font-weight: 500; font-size: 14px;">${k.name}</div>
                <div style="color: var(--text-muted); font-size: 12px; font-family: monospace;">
                  ${k.value.substring(0, 8)}...${k.value.substring(k.value.length - 4)}
                </div>
              </div>
            </div>
            
            <div style="display: flex; gap: 8px;">
              <button 
                @click=${() => host.handleEdit(k)}
                style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; display: flex; align-items: center;"
                title="Sửa tên"
              >
                <div style="width: 16px; height: 16px;" .innerHTML=${editIcon}></div>
              </button>
              <button 
                @click=${() => host.handleDelete(k.id)}
                style="background: transparent; border: none; color: #d9534f; cursor: pointer; padding: 4px; display: flex; align-items: center;"
                title="Xoá"
              >
                <div style="width: 16px; height: 16px;" .innerHTML=${trashIcon}></div>
              </button>
            </div>
          </div>
        `,
        )}
        
        ${
          host.keys.length === 0
            ? litHtml`
          <div style="padding: 20px; text-align: center; color: var(--text-muted); border: 1px dashed var(--bg-modifier-hover); border-radius: 6px;">
            Chưa có API Key nào.
          </div>
        `
            : ""
        }
      </div>
    </div>
  `;
}
