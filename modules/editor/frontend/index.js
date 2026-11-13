import { registry } from "@modules/registry.js";
import filesIcon from "lucide-static/icons/files.svg?raw";
import "./ed-siderbar/sidebar.js";
import "./ed-editor-group/editor.js";
import "./renderer/mount.js";
import "./ed-mode-banner/mode-banner-mount.js";

registry.registerActivitybarItem({
  id: "explorer",
  icon: filesIcon,
  title: "Explorer",
  order: 10,
});

registry.registerSidebarView("explorer", "module-sidebar");
