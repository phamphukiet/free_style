// metrics.template.js
import { html } from "lit";

function barPct(used, limit) {
  if (!limit) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
}

function barColor(pct) {
  if (pct >= 90) return "var(--chat-bar-danger, #f44747)";
  if (pct >= 70) return "var(--chat-bar-warn, #cca700)";
  return "var(--chat-bar-ok, #4ec9b0)";
}

export function metricsTemplate(host) {
  if (!(host.tokenLimit > 0 || host.tokenUsed > 0)) return "";
  const pct = barPct(host.tokenUsed, host.tokenLimit);
  const used = host.tokenUsed.toLocaleString();
  const label = host.tokenLimit
    ? `${used} / ${host.tokenLimit.toLocaleString()}`
    : `${used} (N/A)`;
  return html`
    <div class="chat-metric-row">
      <span class="chat-metric-label">Token</span>
      <div class="chat-bar-track">
        <div
          class="chat-bar-fill"
          style="width:${pct}%; background:${barColor(pct)}"
        ></div>
      </div>
      <span class="chat-metric-value">${label}</span>
    </div>
  `;
}
