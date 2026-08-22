// selection-handler.js
export async function restoreSelection(host) {
  const saved = await window.api.chat.loadSelection();
  if (!saved) return;
  if (saved.agentId && host.agents.some((a) => a.id === saved.agentId)) {
    await host.handleSelectAgent(saved.agentId);
  } else if (saved.providerId && saved.keyId) {
    const exists = host.keys.some((k) => k.providerId === saved.providerId && k.id === saved.keyId);
    if (exists) await host.handleSelectKey(`${saved.providerId}:${saved.keyId}`, saved.model);
  }
}

export function saveSelection(host) {
  const [providerId, keyId] = host.selectedKeyRef.split(":");
  window.api.chat.saveSelection({
    agentId: host.selectedAgentId || null,
    providerId: providerId || null,
    keyId: keyId || null,
    model: host.selectedModel || null,
  });
}
