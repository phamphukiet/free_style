import { registry } from "@modules/registry.js";
import networkIcon from "lucide-static/icons/network.svg?raw";
import "./org-sidebar/sidebar.js";
import "./org-editor-group/editor.js";

registry.registerActivitybarItem({
  id: "org",
  icon: networkIcon,
  title: "Org",
});
registry.registerSidebarView("org", "module-org-sidebar");
registry.registerEmptyEditorView("org", "module-org-editor-group");
