// need-record.js
// Lấy record ext, không có thì ném lỗi. Dùng chung cho các usecase theo id.

function needRecord({ repo, id }) {
  const record = repo.get({ id });
  if (!record) throw new Error(`Extension "${id}" không tồn tại`);
  return record;
}

module.exports = { needRecord };