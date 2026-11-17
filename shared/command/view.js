// view.js
// Dạng JSON thuần của lệnh để đưa ra ngoài bus (không lộ hàm run).

const summary = (cmd) => ({
  id: cmd.id,
  module: cmd.module,
  label: cmd.label,
  risk: cmd.risk ?? null,
});

const detail = (cmd) => ({ ...summary(cmd), args: cmd.args });

module.exports = { summary, detail };
