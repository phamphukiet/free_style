import { registry } from "@modules/registry.js";
import "./run-handler.js";
import "./setup-card/setup-card.js";

registry.registerEditorAction({
  id: "runner.run",
  title: "Run Code",
  glyph: "▶",
  event: "runner:run",
});

document.body.appendChild(document.createElement("runner-setup-card"));
