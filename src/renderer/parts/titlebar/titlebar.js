// titlebar.js
// Trách nhiệm duy nhất: gắn sự kiện cho 3 nút điều khiển window,
// gọi qua window.api (preload bridge) — không đụng trực tiếp Electron.

// import { createIcons, Minus, Square, X, AppWindow } from "lucide";

import { LitElement, unsafeCSS } from "lit";
import { titlebarTemplate } from "./titlebar.template.js";
import styles from "./titlebar.css?inline";
import { openFolder } from "../../shared/folder-actions.js";

class TitlebarElement extends LitElement {
  static styles = unsafeCSS(styles);

  static properties = {
    title: { type: String },
    menuOpen: { state: true },
  };

  constructor() {
    super();
    this.title = "IDE Workbench";
    this.menuOpen = false;
  }

  handleMinimize() {
    window.api.window.minimize();
  }

  handleMaximize() {
    window.api.window.maximize();
  }

  handleClose() {
    window.api.window.close();
  }

  handleToggleFileMenu() {
    this.menuOpen = !this.menuOpen;
  }

  handleOpenFolder() {
    this.menuOpen = false;
    openFolder();
  }

  render() {
    return titlebarTemplate(this);
  }
}

customElements.define("workbench-titlebar", TitlebarElement);
