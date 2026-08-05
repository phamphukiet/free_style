import { registry } from "@modules/registry.js";
import keyIcon from "lucide-static/icons/key.svg?raw";
import "./pv-sidebar/sidebar.js";
import "./pv-editor-group/editor.js";

// Register providers are now handled dynamically by api module

// Register Activitybar Item
registry.registerActivitybarItem({
  id: "providers",
  icon: keyIcon,
  title: "Providers",
});

// Register Sidebar View mapping
registry.registerSidebarView("providers", "module-pv-sidebar");

// Register Empty Editor View
registry.registerEmptyEditorView("providers", "module-pv-editor-group");
