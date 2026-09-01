import { registry } from "@modules/registry.js";
import botIcon from "lucide-static/icons/bot.svg?raw";
import "./ag-sidebar/sidebar.js";
import "./ag-editor-group/editor.js";

registry.registerActivitybarItem({
  id: "agents",
  icon: botIcon,
  title: "Agents",
});

registry.registerSidebarView("agents", "module-ag-sidebar");
registry.registerEmptyEditorView("agents", "module-ag-editor-group");
