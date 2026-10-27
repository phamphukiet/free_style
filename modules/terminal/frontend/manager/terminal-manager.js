// terminal-manager.js
// Trách nhiệm duy nhất: vòng đời xterm + nối với pty qua window.api.terminal.
// Option (font, theme...) nhận từ effects.js qua applyOptions — không đọc setting trực tiếp.

import { Terminal } from "xterm";
import { FitAddon } from "@xterm/addon-fit";
import { PALETTES, DEFAULT_OPTIONS } from "../renderer/palettes.js";
import { FORMAT } from "../renderer/shell-format.js";
import { bindTerminal } from "../renderer/effects.js";

const EXIT_MSG = "\r\n\x1b[90m[Process exited]\x1b[0m";

export class TerminalManager {
  constructor(container, shellType) {
    this.container = container;
    this.shellType = shellType;
    this.cwd = null; // theo workbench:folder-opened, dùng cho lần spawn kế tiếp
    this._alive = false;
    this._initTerminal();
    this._bindEvents();
    this._unbindOptions = bindTerminal({ host: this });
    this.spawnShell();
  }

  _initTerminal() {
    this.term = new Terminal({
      ...DEFAULT_OPTIONS,
      theme: { ...PALETTES.dark }, // tránh chớp giao diện mặc định trước khi effect tới
      allowTransparency: false,
    });
    this.fitAddon = new FitAddon();
    this.term.loadAddon(this.fitAddon);
    this.term.open(this.container);
    this.fitAddon.fit();
    this._resizeObserver = new ResizeObserver(() => this.resize());
    this._resizeObserver.observe(this.container);
  }

  _bindEvents() {
    this.term.onData((data) => window.api.terminal.write(data));
    this._unsubData = window.api.terminal.onData((c) => this.term.write(c));
    this._unsubExit = window.api.terminal.onExit(() => this._handleExit());
    window.addEventListener("workbench:folder-opened", this._onFolder);
    window.addEventListener("terminal:execute", this._onExecute);
  }

  _onFolder = (e) => {
    this.cwd = e.detail?.folderPath ?? null;
  };

  _onExecute = (e) => this.execute(e.detail);

  _handleExit() {
    this._alive = false;
    this.term.writeln(EXIT_MSG);
  }

  // Được effects.js gọi mỗi khi setting đổi (font, theme, cursor...).
  applyOptions(options) {
    Object.assign(this.term.options, options);
    const bg = options.theme?.background;
    if (bg) this.container.style.background = bg;
    this.resize();
  }

  async _loadCwd() {
    try {
      return (await window.api.state.loadLastFolder())?.folderPath;
    } catch {
      return undefined;
    }
  }

  async spawnShell() {
    const cwd = this.cwd ?? (await this._loadCwd());
    await window.api.terminal.create(this.shellType, cwd);
    this._alive = true;
    requestAnimationFrame(() => this.resize());
  }

  resize() {
    if (!this.fitAddon || !this.term) return;
    this.fitAddon.fit();
    const { cols, rows } = this.term;
    if (cols > 0 && rows > 0) window.api.terminal.resize(cols, rows);
  }

  changeShell(shellType) {
    this.shellType = shellType;
    this.term.clear();
    this.spawnShell();
  }

  clear() {
    this.term.clear();
  }

  kill() {
    window.api.terminal.kill();
    this._alive = false;
    this.term.writeln(EXIT_MSG);
  }

  // Editor (Run) bắn "terminal:execute": tự hiện panel, tự dựng lại shell nếu đã chết.
  async execute({ exe, args = [] }) {
    window.dispatchEvent(new CustomEvent("workbench:panel-show"));
    if (!this._alive) await this.spawnShell();
    const format = FORMAT[this.shellType] || FORMAT.powershell;
    window.api.terminal.write(`${format(exe, args)}\r`);
    this.term.focus();
  }

  dispose() {
    this._unsubData?.();
    this._unsubExit?.();
    this._unbindOptions?.();
    this._resizeObserver?.disconnect();
    window.removeEventListener("workbench:folder-opened", this._onFolder);
    window.removeEventListener("terminal:execute", this._onExecute);
    this.term.dispose();
    window.api.terminal.kill();
  }
}
