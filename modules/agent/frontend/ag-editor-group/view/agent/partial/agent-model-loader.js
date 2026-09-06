// agent-model-loader.js
// Trách nhiệm duy nhất: chọn key, tải model, đồng bộ file-limit cho agent-view.
// Tách khỏi agent-view.js để giữ file dưới 100 dòng.

import { fetchModels } from "../../index/shared/editor-keys.js";
import { getFileLimitMB } from "../../index/shared/file-limit.js";

export async function loadModels(host, token) {
  const result = await fetchModels(
    host.keys,
    host.selectedKeyRef,
    token,
    () => host._requestToken,
  );
  if (result === null) return;
  host.models = result;
  if (host.selectedModel && !result.some((m) => m.id === host.selectedModel)) {
    host.selectedModel = result[0]?.id || "";
  }
}

export async function handleKeyChange(host, ref) {
  host.selectedKeyRef = ref;
  host.selectedModel = "";
  host.models = [];
  if (ref) {
    const token = ++host._requestToken;
    await loadModels(host, token);
  }
  await syncFileLimit(host);
}

export async function syncFileLimit(host) {
  const [providerId] = (host.selectedKeyRef || "").split(":");
  host.fileLimitMB = await getFileLimitMB(providerId);
}
