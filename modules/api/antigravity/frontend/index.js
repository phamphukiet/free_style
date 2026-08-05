import { registry } from "@modules/registry.js";

const metadata = {
  id: "antigravity",
  name: "Antigravity",
  abbr: "AG",
  group: "Tools",
  color: "#8e44ad",
  textColor: "#fff",
  desc: "Built-in intelligent toolkit",
  tags: ["local", "tools", "automation"],
};

registry.registerProvider(metadata);
registry.registerProviderEditorView("antigravity", "api-key-manager");
