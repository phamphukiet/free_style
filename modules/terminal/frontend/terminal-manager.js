import { Terminal } from "xterm";
import { FitAddon } from "@xterm/addon-fit";
import {
  getTerminalTheme,
  onTerminalThemeChange,
} from "@shared/terminal-theme.js";

const DEFAULT_FONT = {
  fontSize: 13,
  fontFamily: "'Cascadia Code', 'Consolas', 'Courier New', monospace",
  tabStopWidth: 4,
};

// Base 16-màu mặc định theo "terminal.colorTheme" (001-style, do part terminal
// tự sở hữu). Đây chỉ là NỀN — nếu setting "syntax.palette" (002) có đóng góp
// layer qua terminal-theme.js registry, layer đó luôn được áp SAU CÙNG nên thắng.
const PALETTES = {
  dark: {
    background: "#1e1e1e",
    foreground: "#cccccc",
    cursor: "#aeafad",
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
  light: {
    background: "#ffffff",
    foreground: "#1e1e1e",
    cursor: "#1e1e1e",
    black: "#1e1e1e",
    red: "#cd3131",
    green: "#00871f",
    yellow: "#795e26",
    blue: "#0066b8",
    magenta: "#af00db",
    cyan: "#007c84",
    white: "#5c5c5c",
    brightBlack: "#666666",
    brightBlue: "#0451a5",
  },
  monokai: {
    background: "#272822",
    foreground: "#f8f8f2",
    cursor: "#f8f8f0",
    black: "#272822",
    red: "#f92672",
    green: "#a6e22e",
    yellow: "#e6db74",
    blue: "#66d9ef",
    magenta: "#ae81ff",
    cyan: "#a1efe4",
    white: "#f8f8f2",
    brightBlack: "#75715e",
    brightBlue: "#66d9ef",
  },
};

export class TerminalManager {
  constructor(container, shellType) {
    this.shellType = shellType;
    this._initTerminal(container);
    this._bindEvents();
    this._trySubscribeSettings();
    // Nghe mọi setting đóng góp màu Terminal qua registry chung (hiện tại là
    // syntax.palette) — hoàn toàn không biết settingId nào đang gọi.
    this._unsubTerminalTheme = onTerminalThemeChange(() =>
      this._applyTerminalThemeLayer(),
    );
    this._applyTerminalThemeLayer();
    this.spawnShell();
  }

  // Áp layer từ registry chung LÊN TRÊN theme hiện tại — gọi lại hàm này bất
  // cứ khi nào theme gốc đổi (VD sau loadFontSettings) để 002 luôn thắng.
  _applyTerminalThemeLayer() {
    Object.assign(this.term.options.theme, getTerminalTheme());
  }

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

  // base (001) trước, layer registry (002...) đè sau — đúng thứ tự ưu tiên.
  _resolveTheme(id) {
    return {
      ...this.term.options.theme,
      ...(PALETTES[id] || PALETTES.dark),
      ...getTerminalTheme(),
    };
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
      tabStopWidth: DEFAULT_FONT.tabStopWidth,
      // Set sẵn base "dark" ngay từ đầu để tránh chớp giao diện mặc định của
      // xterm trong lúc loadFontSettings() (async) chưa kịp resolve.
      theme: { ...PALETTES.dark },
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
    this._unsubTerminalTheme?.();
    this._resizeObserver?.disconnect();
    this.term.dispose();
    window.api.terminal.kill();
  }
}
