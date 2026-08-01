import * as monaco from "monaco-editor";

function mountEditor(container) {
  const instance = monaco.editor.create(container, {
    value: "",
    theme: "vs-dark",
    fontFamily: "Consolas, 'Courier New', monospace",
    fontSize: 14,
    tabSize: 2,
    insertSpaces: true,
    automaticLayout: true,
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    cursorBlinking: "blink",
    cursorSmoothCaretAnimation: "on",
    renderWhitespace: "selection",
    wordWrap: "on"
  });
  requestAnimationFrame(() => instance.layout());
  return instance;
}

export { mountEditor };
