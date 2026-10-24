// target "monaco.theme": mỗi source (id setting) là 1 layer của Monaco.
import * as monaco from "monaco-editor";
import { registerEffectHandler } from "@shared/setting/effect.js";

const layers = {}; // { [source]: { base?, rules? } }

function render() {
  const merged = Object.values(layers).reduce(
    (acc, l) => ({
      base: l.base || acc.base,
      rules: l.rules ? [...acc.rules, ...l.rules] : acc.rules,
    }),
    { base: "vs-dark", rules: [] },
  );
  monaco.editor.defineTheme("workbench-theme", {
    base: merged.base,
    inherit: true,
    rules: merged.rules,
    colors: {},
  });
  monaco.editor.setTheme("workbench-theme");
}

registerEffectHandler({
  target: "monaco.theme",
  handler: ({ source, payload }) => {
    layers[source] = payload || {};
    render();
  },
});
