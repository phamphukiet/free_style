import { LitElement, unsafeCSS } from "lit";
import { activitybarTemplate } from "./activitybar.template.js";
import styles from "./activitybar.css?inline";

class ActivitybarElement extends LitElement {
  static styles = unsafeCSS(styles);

  static properties = {
    activeId: { type: String },
  };

  constructor() {
    super();
    this.activeId = "explorer"; // mặc định, Giai đoạn 4 sẽ đổi qua registry
  }

  handleIconClick(id) {
    // Giai đoạn 1: chỉ giữ chỗ, chưa gọi sidebar.showPanel() qua registry.
    this.activeId = id;
  }

  render() {
    return activitybarTemplate(this);
  }
}

customElements.define("workbench-activitybar", ActivitybarElement);
