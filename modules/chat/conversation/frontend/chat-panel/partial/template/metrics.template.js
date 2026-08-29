// metrics.template.js
import { html } from "lit";

function fmtBytes(b) {
  if (b >= 1048576) return (b / 1048576).toFixed(1) + " MB";
  if (b >= 1024) return (b / 1024).toFixed(1) + " KB";
  return b + " B";
}

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
  const projPct = barPct(host.projectBytes, host.projectLimit);
  const tokPct = barPct(host.tokenUsed, host.tokenLimit);
  const showProjectBar = host.projectLimit > 0;
  const showTokenBar = host.tokenLimit > 0 || host.tokenUsed > 0;

  const projectBar = showProjectBar
    ? html`
        <div class="chat-metric-row">
          <span class="chat-metric-label">Project</span>
          <div class="chat-bar-track">
            <div
              class="chat-bar-fill"
              style="width:${projPct}%; background:${barColor(projPct)}"
            ></div>
          </div>
          <span class="chat-metric-value">
            ${fmtBytes(host.projectBytes)} / ${fmtBytes(host.projectLimit)}
          </span>
        </div>
      `
    : "";

  const tokenBar = showTokenBar
    ? html`
        <div class="chat-metric-row">
          <span class="chat-metric-label">Token</span>
          <div class="chat-bar-track">
            <div
              class="chat-bar-fill"
              style="width:${tokPct}%; background:${barColor(tokPct)}"
            ></div>
          </div>
          <span class="chat-metric-value">
            ${host.tokenLimit
              ? `${host.tokenUsed.toLocaleString()} / ${host.tokenLimit.toLocaleString()}`
              : host.tokenUsed > 0
                ? `${host.tokenUsed.toLocaleString()} (N/A)`
                : "N/A"}
          </span>
        </div>
      `
    : "";

  return html`${projectBar}${tokenBar}`;
}
