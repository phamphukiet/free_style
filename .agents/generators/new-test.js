// new-test.js
// Sinh 1 file test mới: .agents/test/<category>/<name>.test.js theo template
// chuẩn (dùng chung lib/kit.js). Không cần đụng run.js — run.js tự discover.
// Dùng: node .agents/generators/new-test.js <category> <name>
// VD:   node .agents/generators/new-test.js chat hello

const fs = require("fs");
const path = require("path");

const TEST_ROOT = path.resolve(__dirname, "../test");

function template(testId) {
  return `// ${testId} — mô tả mục đích test ở đây.
const { runCase, assert } = require("../lib/kit");

async function scenario(note) {
  // TODO: viết kịch bản, dùng assert(...) để kiểm tra, note(...) để ghi chú.
  assert(true, "Thay bằng điều kiện thật");
}

async function run() {
  return runCase("${testId}", scenario);
}

if (require.main === module) {
  run().then((result) => {
    console.log(JSON.stringify(result, null, 2));
    process.exitCode = result.ok ? 0 : 1;
  });
}

module.exports = { run };
`;
}

function createTestFile(category, name) {
  if (!category || !name) {
    throw new Error("Cần truyền <category> <name>. VD: chat hello");
  }
  const dir = path.join(TEST_ROOT, category);
  fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, `${name}.test.js`);
  if (fs.existsSync(filePath)) {
    throw new Error(`Đã tồn tại: ${filePath}`);
  }

  fs.writeFileSync(
    filePath,
    template(`.agents/test/${category}/${name}.test.js`),
    "utf-8",
  );
  return filePath;
}

if (require.main === module) {
  const [category, name] = process.argv.slice(2);
  try {
    console.log(`Đã tạo: ${createTestFile(category, name)}`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { createTestFile };
