// agent-loader.js
// Optional dependency — không crash nếu modules/agent không tồn tại.

export async function loadAgents(host) {
  try {
    if (!window.api.agent?.list) {
      host.agents = [];
      return;
    }
    const list = await window.api.agent.list();
    host.agents = Array.isArray(list) ? list : [];
    syncAgentLimits(host);
  } catch {
    host.agents = [];
  }
}

export function syncAgentLimits(host) {
  if (!host.selectedAgentId) return;
  const agent = host.agents.find((a) => a.id === host.selectedAgentId);
  host.tokenLimit = agent?.tokenLimit || 0;
  host.projectLimit = agent?.projectLimit || 0;
}

export async function handleSelectAgent(host, id) {
  host.selectedAgentId = id;
  syncAgentLimits(host);
  host.saveSelection();
}
