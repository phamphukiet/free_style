// role-handlers.js
import { fetchModels } from "../../shared/editor-keys.js";
import { loadRoleDetail } from "./role-loader.js";

export function makeRoleHandlers(host) {
  return {
    async handleRoleParentChange(parentId) {
      await window.api.org.updateRoleParent(host.contextId, parentId || null);
      window.dispatchEvent(new CustomEvent("org:changed"));
    },

    async handleDeleteRole() {
      const role = host.role;
      if (!role || role.id === "manager") return;
      if (!window.confirm("Xoá vai trò này? Không thể hoàn tác.")) return;
      await window.api.org.removeRole(role.id);
      window.dispatchEvent(
        new CustomEvent("org:select-role", { detail: { roleId: "" } }),
      );
      window.dispatchEvent(new CustomEvent("org:changed"));
    },

    startAddInstance() {
      host.addingInstance = true;
      host.newInstanceName = host.role?.name || "";
      host.newInstanceKeyRef = "";
      host.newInstanceModels = [];
      host.newInstanceModel = "";
    },
    cancelAddInstance() {
      host.addingInstance = false;
    },

    async handleNewInstanceKey(ref) {
      host.newInstanceKeyRef = ref;
      host.newInstanceModel = "";
      host.newInstanceModels = [];
      if (!ref) return;
      const token = ++host._requestToken;
      const result = await fetchModels(
        host.keys,
        ref,
        token,
        () => host._requestToken,
      );
      if (result === null) return;
      host.newInstanceModels = result;
    },

    async handleConfirmAddInstance() {
      const { newInstanceName, newInstanceKeyRef, newInstanceModel, role } =
        host;
      const [providerId, keyId] = (newInstanceKeyRef || "").split(":");
      const agent = await window.api.agent.save(
        {
          name: newInstanceName.trim() || role.name,
          providerId: providerId || "",
          keyId: keyId || "",
          model: newInstanceModel || "",
        },
        { actorRoleId: "manager", targetRoleId: role.id },
      );
      await window.api.org.addInstance(role.id, agent.id);
      window.dispatchEvent(new CustomEvent("agents:changed"));
      window.dispatchEvent(new CustomEvent("org:changed"));
      host.addingInstance = false;
      await loadRoleDetail(host);
    },

    async handleRemoveInstance(instanceId) {
      if (!window.confirm("Gỡ agent này khỏi vai trò?")) return;
      await window.api.org.removeInstance(instanceId);
      window.dispatchEvent(new CustomEvent("org:changed"));
      await loadRoleDetail(host);
    },
  };
}
