// index.js
// Điểm export duy nhất cho "dedupe_level": nhóm các cơ chế giảm tải API request
// theo cấp độ — dedupe (chặn tool call trùng trong 1 lượt) và todo (theo dõi
// tiến độ để giảm việc AI tự lặp lại hành động). Optional theo từng cấp,
// thiếu 1 cấp không ảnh hưởng cấp còn lại.

function safeRequire(path) {
  try {
    return require(path);
  } catch {
    return null;
  }
}

module.exports = {
  dedupe: safeRequire("./dedupe/index.js"),
  todo: safeRequire("./todo/tool/index.js"),
};
