import { registry } from "@modules/registry.js";
import "./gemini-key-creator.js";

const metadata = {
  id: "gemini",
  name: "Google Gemini",
  abbr: "GM",
  group: "AI",
  color: "#4285f4",
  textColor: "#fff",
  desc: "Google's multimodal large language model",
  tags: ["chat", "multimodal", "fast"],
};

registry.registerProvider(metadata);
registry.registerProviderEditorView("gemini", "api-key-manager");
registry.registerProviderCreatorView("gemini", "gemini-key-creator");
