import { registry } from "@modules/registry.js";
import kanbanIcon from "lucide-static/icons/kanban.svg?raw";
import "./kanban-sidebar/sidebar.js";
import "./kanban-editor-group/editor.js";

registry.registerActivitybarItem({
  id: "kanban",
  icon: kanbanIcon,
  title: "Kanban",
});
registry.registerSidebarView("kanban", "module-kanban-sidebar");
registry.registerEmptyEditorView("kanban", "module-kanban-editor-group");