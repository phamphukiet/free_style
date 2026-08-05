import { registry } from "@modules/registry.js";
import "./chatgpt-key-creator.js";

const metadata = {
  id: "chatgpt",
  name: "ChatGPT",
  abbr: "GP",
  group: "AI",
  color: "#10a37f",
  textColor: "#fff",
  desc: "OpenAI's conversational AI model",
  tags: ["chat", "code", "reasoning"],
};

registry.registerProvider(metadata);
registry.registerProviderEditorView("chatgpt", "api-key-manager");
registry.registerProviderCreatorView("chatgpt", "chatgpt-key-creator");

