// role-handlers.js
import { fetchModels } from "../editor-keys.js";
import { loadRoleDetail } from "./role-loader.js";

export function makeRoleHandlers(host) {
  return {
    async handleRoleParentChange(parentId) {
      await window.api.org.updateRoleParent(
        host.roleState.roleId,
        parentId || null,
      );
      window.dispatchEvent(new CustomEvent("org:changed"));
    },

    async handleDeleteRole() {
      const role = host.roleState.role;
      if (!role || role.id === "manager") return;
      if (!window.confirm("Xoá vai trò này? Không thể hoàn tác.")) return;
      await window.api.org.removeRole(role.id);
      window.dispatchEvent(
        new CustomEvent("org:select-role", { detail: { roleId: "" } }),
      );
      window.dispatchEvent(new CustomEvent("org:changed"));
    },

    startAddInstance() {
      host.roleState = {
        ...host.roleState,
        addingInstance: true,
        newInstanceName: host.roleState.role?.name || "",
        newInstanceKeyRef: "",
        newInstanceModels: [],
        newInstanceModel: "",
      };
    },
    cancelAddInstance() {
      host.roleState = { ...host.roleState, addingInstance: false };
    },

    async handleNewInstanceKey(ref) {
      host.roleState = {
        ...host.roleState,
        newInstanceKeyRef: ref,
        newInstanceModel: "",
        newInstanceModels: [],
      };
      if (!ref) return;
      const token = ++host._requestToken;
      const result = await fetchModels(
        host.keys,
        ref,
        token,
        () => host._requestToken,
      );
      if (result === null) return;
      host.roleState = { ...host.roleState, newInstanceModels: result };
    },

    async handleConfirmAddInstance() {
      const { newInstanceName, newInstanceKeyRef, newInstanceModel, role } =
        host.roleState;
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
      host.roleState = { ...host.roleState, addingInstance: false };
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
