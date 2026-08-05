import { registry } from "@modules/registry.js";
import "./api-editor.js";

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
registry.registerProviderEditorView("chatgpt", "module-api-chatgpt");
