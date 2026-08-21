import { registry } from "@modules/registry.js";
import settingsIcon from "lucide-static/icons/settings.svg?raw";
import "./st-sidebar/sidebar.js";
import "./st-editor-group/editor.js";
import "./apply-loader.js";

registry.registerActivitybarItem({
  id: "settings",
  icon: settingsIcon,
  title: "Settings",
  placement: "bottom",
});
registry.registerSidebarView("settings", "module-st-sidebar");
registry.registerEmptyEditorView("settings", "module-st-editor-group");
