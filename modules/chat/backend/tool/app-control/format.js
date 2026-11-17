// format.js
// Rút gọn kết quả cho model (ít token) và gợi ý id gần giống khi gọi sai.

const ok = (extra) => ({ ok: true, ...extra });
const fail = (error) => ({ ok: false, error });

const line = (cmd) => `${cmd.id} — ${cmd.label} [${cmd.risk ?? "?"}]`;

function formatList({ commands, module }) {
  if (commands.length === 0) {
    const scope = module ? ` cho module "${module}"` : "";
    return ok({ commands: [], message: `Chưa có lệnh nào khả dụng${scope}.` });
  }
  return ok({ commands: commands.map(line) });
}

function suggestIds({ id, ids }) {
  const query = String(id ?? "").toLowerCase();
  const [mod, name = ""] = query.split(".");
  const near = (candidate) => {
    const low = candidate.toLowerCase();
    return (
      low.includes(query) ||
      (name !== "" && low.endsWith(`.${name}`)) ||
      low.startsWith(`${mod}.`)
    );
  };
  return ids.filter(near).slice(0, 5);
}

module.exports = { ok, fail, formatList, suggestIds };
