// index.js (runtimes registry)
// Thêm ngôn ngữ mới = tạo runtimes/<lang>/<lang>.js rồi đăng ký ở đây (mẫu terminal/platform).

const js = require("./js/js");

const REGISTRY = {
  [js.id]: js,
};

function getRuntime({ language }) {
  const runtime = REGISTRY[language];
  if (!Object.hasOwn(REGISTRY, language) || !runtime) {
    throw new Error(`Ngôn ngữ "${language}" chưa được hỗ trợ`);
  }
  return runtime;
}

const listRuntimes = () =>
  Object.values(REGISTRY).map(({ id, label, entry }) => ({ id, label, entry }));

module.exports = { getRuntime, listRuntimes };
