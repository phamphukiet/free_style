// Module đăng ký tên có thể @mention trong chat; chat chỉ đọc danh sách.
const mentions = new Map(); // name -> { hint }

function registerMention(name, { hint = "" } = {}) {
  mentions.set(name, { hint });
}

const listMentions = () =>
  [...mentions].map(([name, { hint }]) => ({ name, hint }));

module.exports = { registerMention, listMentions };
