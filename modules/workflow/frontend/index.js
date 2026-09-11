import { registry } from "@modules/registry.js";
import workflowIcon from "lucide-static/icons/workflow.svg?raw";
import "./wf-sidebar/sidebar.js";
import "./wf-editor-group/editor.js";
import "./auto-install-listener.js";

registry.registerActivitybarItem({
  id: "workflow",
  icon: workflowIcon,
  title: "Workflow",
});
registry.registerSidebarView("workflow", "module-wf-sidebar");
registry.registerEmptyEditorView("workflow", "module-wf-editor-group");
