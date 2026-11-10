// broadcast.js
// Báo renderer danh sách ext đã đổi (sidebar tự tải lại).

const CHANGED_CHANNEL = "extension:changed";

/** @param {{ broadcast: (arg: { channel: string, payload?: any }) => void }} deps */
function createBroadcastChanged({ broadcast }) {
  return () => broadcast({ channel: CHANGED_CHANNEL });
}

module.exports = { CHANGED_CHANNEL, createBroadcastChanged };
