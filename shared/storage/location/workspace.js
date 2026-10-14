// Theo dõi project đang mở qua key "lastFolder" của namespace "state" (global).
// Lần chạy đầu nhập state.json từ userData cũ để không mất project đang mở.

const STATE_NAMESPACE = "state";
const KEY = "lastFolder";
const LEGACY = { file: "state.json", from: "userData" };

/** @param {{ open: Function, onFolder: (arg: { folder: string|null }) => void }} args */
function followLastFolder({ open, onFolder }) {
  const state = open({
    namespace: STATE_NAMESPACE,
    scopes: ["global"],
    legacy: LEGACY,
  });
  const read = () => state.get({ key: KEY, fallback: null });
  onFolder({ folder: read() });
  return state.onDidChange({
    listener: ({ key }) => key === KEY && onFolder({ folder: read() }),
  });
}

module.exports = { followLastFolder };
