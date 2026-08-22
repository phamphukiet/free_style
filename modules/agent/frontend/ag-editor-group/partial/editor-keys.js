// editor-keys.js
// Tách logic load keys + models ra khỏi editor.js để giữ < 100 dòng.

import { registry } from "@modules/registry.js";

export async function loadKeys() {
  const providers = registry.getProviders();
  const lists = await Promise.all(
    providers.map(async (p) => {
      const ks = await window.api.credentials.list(p.id);
      return ks.map((k) => ({ ...k, providerId: p.id, providerName: p.name }));
    }),
  );
  return lists.flat();
}

export async function loadModels(selectedKeyRef, currentToken, getToken) {
  const [providerId, keyId] = selectedKeyRef.split(":");
  if (!providerId || !keyId) return null;
  if (!window.api.providers?.listModels) return null;

  // Tìm key trong danh sách đã có — caller truyền vào qua closure
  return { providerId, keyId };
}

export async function fetchModels(keys, selectedKeyRef, requestToken, getToken) {
  const [providerId, keyId] = selectedKeyRef.split(":");
  const keyObj = keys.find((k) => k.providerId === providerId && k.id === keyId);
  if (!keyObj || !window.api.providers?.listModels) return [];
  const result = await window.api.providers.listModels(providerId, keyObj.value);
  if (getToken() !== requestToken) return null; // cancelled
  return Array.isArray(result) ? result : [];
}
