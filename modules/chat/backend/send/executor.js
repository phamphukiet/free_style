// executor.js — điều phối tool call theo tên tool trong registry, không theo đường dẫn.
const { guard } = require("../select/health");

function toolContext(cap, ctx, notify) {
  return {
    agentId: ctx.agentId,
    sessionId: ctx.sessionId,
    notify: (info) => cap.notify && notify(cap.notify, info),
  };
}

function makeExecutor(tools, ctx, notify) {
  const byName = new Map(tools.map((cap) => [cap.spec.name, cap]));
  return async (name, args = {}) => {
    const cap = byName.get(name);
    if (!cap) return { error: `Tool "${name}" không khả dụng.` };
    ctx.calledTools.push(cap.id);
    return guard(
      ctx.sessionId,
      cap,
      () => cap.execute(args, toolContext(cap, ctx, notify)),
      (error) => ({ error: error.message }),
    );
  };
}

module.exports = { makeExecutor };
