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
  level01Dedupe: safeRequire("./level_01_dedupe/index.js"),
  level02Cache: safeRequire("./level_02_cache/index.js"),
  level03Todo: safeRequire("./level_03_todo/tool/index.js"),
  level04Continuation: safeRequire("./level_04_continuation/index.js"),
};
