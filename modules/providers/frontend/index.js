import { registry } from "@modules/registry.js";
import keyIcon from "lucide-static/icons/key.svg?raw";
import "./pv-sidebar/sidebar.js";
import "./pv-editor-group/editor.js";

// Import all providers metadata
import chatgpt from "./providers/chatgpt/index.js";
import gemini from "./providers/gemini/index.js";
import anti from "./providers/anti/index.js";
import codex from "./providers/codex/index.js";

// Register providers
registry.registerProvider(chatgpt);
registry.registerProvider(gemini);
registry.registerProvider(anti);
registry.registerProvider(codex);

// Register Activitybar Item
registry.registerActivitybarItem({
  id: "providers",
  icon: keyIcon,
  title: "Providers",
});

// Register Sidebar View mapping
registry.registerSidebarView("providers", "module-pv-sidebar");

// Register Empty Editor View
registry.registerEmptyEditorView("module-pv-editor-group");
