// 2.1.delete_all.test.js
// Kịch bản: user muốn dọn sạch, xoá TOÀN BỘ extension đang có.
// Dùng thư mục THẬT (~/.vibe) → ĐÓNG APP trước khi chạy. Chạy:
//   node modules/extension/test/2.1.delete_all.test.js

// ===== THỬ CÁC CASE KHÁC: chỉ cần sửa các hằng số này =====
const CONFIRM = false; // true: hỏi y/N trước khi xoá · false: chạy là xoá luôn
const DRY_RUN = false; // true: chỉ liệt kê những gì SẼ bị xoá, không xoá gì
// =========================================================

const fs = require("fs");
const path = require("path");
const { createWorld } = require("./_env");
const { step, say } = require("./_show");

const readJson = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return {};
  }
};

const extDir = (world) => path.join(world.home, "extensions");

function folders(world) {
  if (!fs.existsSync(extDir(world))) return [];
  return fs
    .readdirSync(extDir(world), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

// Ext = record trong extensions.json HOẶC thư mục trong extensions/ (kể cả thư mục mồ côi chưa có record).
const allIds = (world) => [
  ...new Set([
    ...world.usecases.list().map((row) => row.id),
    ...folders(world),
  ]),
];

async function showDisk({ world, ids }) {
  await world.flush();
  const mine = (key) =>
    ids.some((id) => key === id || key.startsWith(`${id}.`));
  const list = (keys) => keys.filter(mine).join(", ") || "(không có)";
  const keysOf = (name) => Object.keys(readJson(path.join(world.home, name)));
  say(`thư mục extensions/ : ${list(folders(world))}`);
  say(`extensions.json     : ${list(keysOf("extensions.json"))}`);
  say(`settings.json       : ${list(keysOf("settings.json"))}`);
}

function showList({ world, ids }) {
  const known = new Set(world.usecases.list().map((row) => row.id));
  ids.forEach((id) => {
    const note = known.has(id)
      ? `${world.view(id).status} — "${world.view(id).name}"`
      : "thư mục mồ côi (chưa có record)";
    say(`• ${id}  →  ${note}`);
  });
}

async function ask(question) {
  const rl = require("readline/promises").createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const answer = await rl.question(question);
  rl.close();
  return answer.trim().toLowerCase();
}

// Có record → dùng đúng usecase user bấm xoá. Thư mục mồ côi → usecase không biết tới, xoá tay.
async function removeOne({ world, id }) {
  if (world.usecases.list().some((row) => row.id === id))
    return world.usecases.remove({ id });
  fs.rmSync(path.join(extDir(world), id), { recursive: true, force: true });
  world.settingsStore
    .keys()
    .filter((key) => key.startsWith(`${id}.`))
    .forEach((key) => world.settingsStore.delete({ key }));
}

async function removeAll({ world, ids }) {
  for (const id of ids) {
    await removeOne({ world, id }).then(
      () => say(`đã xoá "${id}"`),
      (error) => say(`KHÔNG xoá được "${id}": ${error.message}`),
    );
  }
}

async function main() {
  const world = createWorld({ real: true });
  try {
    step("1. Hiện có gì trong thư mục thật");
    say(`thư mục thật: ${world.home}`);
    const ids = allIds(world);
    if (ids.length === 0) return say("không có ext nào để xoá");
    showList({ world, ids });
    await showDisk({ world, ids });
    if (DRY_RUN) return say("DRY_RUN = true → dừng ở đây, không xoá gì");
    if (
      CONFIRM &&
      (await ask(`\nXoá ${ids.length} ext ở trên? (y/N): `)) !== "y"
    )
      return say("đã huỷ, không xoá gì");

    step(`2. Xoá ${ids.length} ext`);
    await removeAll({ world, ids });

    step("3. Trên đĩa thật sau khi xoá");
    await showDisk({ world, ids });
    say(`ext còn lại: ${allIds(world).join(", ") || "(không còn ext nào)"}`);
  } catch (error) {
    console.error("\n💥 Test dừng vì lỗi bất ngờ:", error.stack);
    process.exitCode = 1;
  } finally {
    await world.cleanup({ keep: false }); // thư mục thật: chỉ đóng storage, không xoá gì thêm
  }
}

main();
