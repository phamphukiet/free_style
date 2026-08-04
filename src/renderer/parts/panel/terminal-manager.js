// terminal-manager.js
import { Terminal } from "xterm";
import { FitAddon } from "@xterm/addon-fit";

export class TerminalManager {
  constructor(container, shellType) {
    this.shellType = shellType;
    this._initTerminal(container);
    this._bindEvents();
    this.spawnShell();
  }

  _initTerminal(container) {
    this.term = new Terminal({
      fontSize: 13,
      fontFamily: "'Cascadia Code', 'Consolas', 'Courier New', monospace",
      theme: {
        background: "#1e1e1e", foreground: "#cccccc", cursor: "#aeafad",
        selectionBackground: "#264f78", black: "#1e1e1e", red: "#f44747",
        green: "#6a9955", yellow: "#ce9178", blue: "#569cd6", magenta: "#c586c0",
        cyan: "#4ec9b0", white: "#d4d4d4", brightBlack: "#808080", brightBlue: "#5af",
      },
      cursorBlink: true, allowTransparency: false, scrollback: 5000,
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
    this._unsubData = window.api.terminal.onData((chunk) => this.term.write(chunk));
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

  clear() { this.term.clear(); }

  kill() {
    window.api.terminal.kill();
    this.term.writeln("\r\n\x1b[90m[Process exited]\x1b[0m");
  }

  dispose() {
    this._unsubData?.();
    this._resizeObserver?.disconnect();
    this.term.dispose();
    window.api.terminal.kill();
  }
}
