// ext-item.js
// 1 ext trong danh sách: công tắc bật/tắt, nút Xoá, các ô setting do ext khai báo.
// Lưu trạng thái và giá trị do backend + shared/storage lo, ở đây chỉ gọi bridge.

import { LitElement, unsafeCSS } from "lit";
import { extItemTemplate } from "./ext-item.template.js";
import itemStyles from "./ext-item.css?inline";
import fieldStyles from "../ext-field/ext-field.css?inline";
import {
  setEnabled,
  removeExtension,
  setExtValue,
} from "../render/ext-bridge.js";
import { attempt, toast } from "../render/ext-actions.js";

class ExtItemElement extends LitElement {
  static styles = [unsafeCSS(itemStyles), unsafeCSS(fieldStyles)];
  static properties = {
    item: { attribute: false },
    fields: { attribute: false },
    open: { state: true },
  };

  constructor() {
    super();
    this.item = null;
    this.fields = [];
    this.open = true;
  }

  handleToggleOpen() {
    this.open = !this.open;
  }

  // Bật thất bại: trả công tắc về vị trí cũ và hiện lý do.
  async handleToggle(e) {
    const box = e.target;
    const enabled = box.checked;
    try {
      await setEnabled({ id: this.item.id, enabled });
    } catch (error) {
      box.checked = !enabled;
      toast(
        `Không ${enabled ? "bật" : "tắt"} được "${this.item.name}": ${error.message}`,
      );
    }
  }

  handleChange(field, value) {
    return attempt(() =>
      setExtValue({ id: this.item.id, key: field.key, value }),
    );
  }

  handleRemove() {
    if (!window.confirm(`Xoá "${this.item.name}"?`)) return;
    return attempt(() => removeExtension({ id: this.item.id }));
  }

  render() {
    return extItemTemplate(this);
  }
}

customElements.define("ext-item", ExtItemElement);
