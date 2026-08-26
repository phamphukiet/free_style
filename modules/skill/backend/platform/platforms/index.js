// index.js (registry các adapter platform CÓ THẬT)
// Chỉ platform ở đây mới hợp lệ — không còn "generic URL platform" (bug gốc:
// skills.sh trả HTML, tưởng nhầm kết nối được). Thêm nền tảng mới: viết file
// theo mẫu github.js/npm.js rồi đăng ký ở REGISTRY, không sửa gì nơi khác.

const github = require("./github");
const npm = require("./npm");

const REGISTRY = {
  [github.GITHUB_PLATFORM.id]: {
    definition: github.GITHUB_PLATFORM,
    isInput: github.isGithubInput,
    search: github.searchGithub,
  },
  [npm.NPM_PLATFORM.id]: {
    definition: npm.NPM_PLATFORM,
    isInput: npm.isNpmInput,
    search: npm.searchNpm,
  },
};

// GitHub luôn có sẵn, không cho xoá — đảm bảo app luôn có ít nhất 1 nguồn
// search hoạt động (tương tự MANAGER_ID ở agent/store.js).
const DEFAULT_PLATFORM_IDS = [github.GITHUB_PLATFORM.id];

function listAdapters() {
  return Object.values(REGISTRY);
}
function matchAdapter(rawInput) {
  return listAdapters().find((a) => a.isInput(rawInput)) || null;
}
function getAdapter(id) {
  return REGISTRY[id] || null;
}

module.exports = {
  listAdapters,
  matchAdapter,
  getAdapter,
  DEFAULT_PLATFORM_IDS,
};
