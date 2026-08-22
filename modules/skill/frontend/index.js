import { registry } from "@modules/registry.js";
import packageIcon from "lucide-static/icons/package.svg?raw";
import "./sk-sidebar/sidebar.js";
import "./sk-editor-group/editor.js";

registry.registerActivitybarItem({
  id: "skills",
  icon: packageIcon,
  title: "Skills",
});
registry.registerSidebarView("skills", "module-sk-sidebar");
registry.registerEmptyEditorView("skills", "module-sk-editor-group");
