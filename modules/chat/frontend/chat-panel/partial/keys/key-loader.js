// key-loader.js
import { registry } from "@modules/registry.js";

export async function loadKeys(host) {
  const providers = registry.getProviders();
  const lists = await Promise.all(
    providers.map(async (p) => {
      const keys = await window.api.credentials.list(p.id);
      return keys.map((k) => ({ ...k, providerId: p.id, providerName: p.name }));
    }),
  );
  host.keys = lists.flat();
}

export async function handleSelectKey(host, ref, preferredModel = null) {
  host.selectedKeyRef = ref;
  host.selectedModel = "";
  host.models = [];
  const [providerId, keyId] = ref.split(":");
  const keyObj = host.keys.find(
    (k) => k.providerId === providerId && k.id === keyId,
  );
  if (!keyObj || !window.api.providers.listModels) return;
  
  const result = await window.api.providers.listModels(providerId, keyObj.value);
  if (Array.isArray(result)) {
    host.models = result;
    if (preferredModel && result.some((m) => m.id === preferredModel)) {
      host.selectedModel = preferredModel;
    } else if (result.length > 0) {
      host.selectedModel = result[0].id;
    }
  }
  host.saveSelection();
}

export function handleSelectModel(host, model) {
  host.selectedModel = model;
  host.saveSelection();
}
