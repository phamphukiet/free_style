import { registry } from "@modules/registry.js";
import "./ext-page/ext-page.js";
import "./render/run-action.js";

registry.registerSettingsPage({
  id: "extension-code",
  label: "Extension (lập trình)",
  tag: "module-ext-page",
  order: 50,
});
