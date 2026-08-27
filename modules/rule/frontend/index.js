import { registry } from "@modules/registry.js";
import clipboardListIcon from "lucide-static/icons/clipboard-list.svg?raw";
import "./rl-sidebar/sidebar.js";
import "./rl-editor-group/editor.js";
import "./auto-install-listener.js";

registry.registerActivitybarItem({
  id: "rules",
  icon: clipboardListIcon,
  title: "Rules",
});
registry.registerSidebarView("rules", "module-rl-sidebar");
registry.registerEmptyEditorView("rules", "module-rl-editor-group");
