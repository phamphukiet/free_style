import { registry } from "@modules/registry.js";
import filesIcon from "lucide-static/icons/files.svg?raw";
import "./ed-siderbar/sidebar.js";
import "./ed-editor-group/editor.js";
import "./mount.js"; // if needed
import "./bridge.js"; // if needed

// Register Activitybar Item
registry.registerActivitybarItem({
  id: "explorer",
  icon: filesIcon,
  title: "Explorer",
});

// Register Sidebar View
registry.registerSidebarView("explorer", "module-sidebar");
