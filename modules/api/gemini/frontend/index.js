import { registry } from "@modules/registry.js";

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
