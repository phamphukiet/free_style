import { registry } from "@modules/registry.js";

const metadata = {
  id: "codex",
  name: "OpenAI Codex",
  abbr: "CX",
  group: "AI",
  color: "#1a73e8",
  textColor: "#fff",
  desc: "Specialized model for code generation",
  tags: ["code", "autocomplete"],
};

registry.registerProvider(metadata);
registry.registerProviderEditorView("codex", "api-key-manager");
