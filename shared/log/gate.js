// gate.js
// Hai lớp lọc, hàm thuần.
//   Đóng băng: module không còn trong active-modules thì tắt hẳn.
//   Tiêu điểm: chỉ topic nằm trong focus mới được nói (focus null = không lọc).
// Lỗi chỉ qua lớp đóng băng, không bị ẩn bởi tiêu điểm.

const isFrozen = ({ owner, active }) =>
  owner !== null && !active.includes(owner);

const isFocused = ({ topic, focus }) => focus === null || focus.includes(topic);

const canFail = (gate) => !isFrozen(gate);
const canSay = (gate) => canFail(gate) && isFocused(gate);

module.exports = { canSay, canFail };
