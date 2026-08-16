// modules/terminal/frontend/terminal-manager.js
// Trách nhiệm duy nhất: dựng & điều khiển 1 instance xterm.js, nối với pty qua window.api.terminal.
// Đặt trong modules/terminal (không phải src/renderer/parts/panel) vì đây là logic
// thuộc domain "terminal" — panel.js chỉ là khung UI chung (tab bar, toolbar).
// KHÔNG hard-require module settings: nếu window.api.settings có mặt thì dùng,
// không thì fallback default cứng — tránh vỡ cả panel khi module khác bị xóa.

import { Terminal } from "xterm";
import { FitAddon } from "@xterm/addon-fit";

const DEFAULT_FONT = {
  fontSize: 13,
  fontFamily: "'Cascadia Code', 'Consolas', 'Courier New', monospace",
  tabStopWidth: 4,
};

const PALETTES = {
  dark: { background: "#1e1e1e", foreground: "#cccccc", cursor: "#aeafad" },
  light: { background: "#ffffff", foreground: "#1e1e1e", cursor: "#1e1e1e" },
  monokai: { background: "#272822", foreground: "#f8f8f2", cursor: "#f8f8f0" },
};

export class TerminalManager {
  constructor(container, shellType) {
    this.shellType = shellType;
    this._initTerminal(container);
    this._bindEvents();
    this._trySubscribeSettings();
    this.spawnShell();
  }

  // Optional dependency: chỉ đăng ký nếu preload thật sự expose settings.
  _trySubscribeSettings() {
    if (!window.api?.settings?.onChanged) return; // module settings không tồn tại — bỏ qua êm
    this._unsubSettings = window.api.settings.onChanged(
      this._onSettingsChanged,
    );
    this.loadFontSettings();
  }

  _onSettingsChanged = (detail) => {
    if (!detail.id.startsWith("terminal.")) return;
    this.loadFontSettings();
  };

  _resolveTheme(id) {
    return { ...this.term.options.theme, ...(PALETTES[id] || PALETTES.dark) };
  }

  async loadFontSettings() {
    if (!window.api?.settings?.getAll) return;
    const all = await window.api.settings.getAll();
    Object.assign(this.term.options, {
      fontSize: Number(all["terminal.fontSize"] ?? DEFAULT_FONT.fontSize),
      fontFamily: all["terminal.fontFamily"] ?? DEFAULT_FONT.fontFamily,
      tabStopWidth: Number(
        all["terminal.tabSize"] ?? DEFAULT_FONT.tabStopWidth,
      ),
      theme: this._resolveTheme(all["terminal.colorTheme"]),
    });
    this.resize();
  }

  _initTerminal(container) {
    this.term = new Terminal({
      fontSize: DEFAULT_FONT.fontSize,
      fontFamily: DEFAULT_FONT.fontFamily,
      theme: {
        ...PALETTES.dark,
        selectionBackground: "#264f78",
        black: "#1e1e1e",
        red: "#f44747",
        green: "#6a9955",
        yellow: "#ce9178",
        blue: "#569cd6",
        magenta: "#c586c0",
        cyan: "#4ec9b0",
        white: "#d4d4d4",
        brightBlack: "#808080",
        brightBlue: "#5af",
      },
      cursorBlink: true,
      allowTransparency: false,
      scrollback: 5000,
    });
    this.fitAddon = new FitAddon();
    this.term.loadAddon(this.fitAddon);
    this.term.open(container);
    this.fitAddon.fit();

    this._resizeObserver = new ResizeObserver(() => this.resize());
    this._resizeObserver.observe(container);
  }

  _bindEvents() {
    this.term.onData((data) => window.api.terminal.write(data));
    this._unsubData = window.api.terminal.onData((chunk) =>
      this.term.write(chunk),
    );
  }

  async spawnShell() {
    let cwd;
    try {
      const state = await window.api.state.loadLastFolder();
      cwd = state?.folderPath;
    } catch (_) {}

    await window.api.terminal.create(this.shellType, cwd);
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
    this.term.writeln("\r\n\x1b[90m[Process exited]\x1b[0m");
  }

  dispose() {
    this._unsubData?.();
    this._unsubSettings?.();
    this._resizeObserver?.disconnect();
    this.term.dispose();
    window.api.terminal.kill();
  }
}
