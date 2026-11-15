// 2.delete.test.js
// Kịch bản: user tạo ext, bật, chỉnh setting, rồi bấm xoá.
// Test này dùng thư mục THẬT (~/.vibe), không phải thư mục tạm → ĐÓNG APP trước khi chạy.
// Chỉ đụng ext do chính test tạo ra. Chạy:  node modules/extension/test/2.delete.test.js

// ===== THỬ CÁC CASE KHÁC: chỉ cần sửa các hằng số này =====
const EXT_NAME = "Delete Test"; // ext sẽ bị xoá → id "delete-test"
const OTHER_NAME = "Delete Test 2"; // ext thứ 2 → id "delete-test-2", đặt tên gần giống để xem xoá nhầm không
const ENABLE_FIRST = false; // true: xoá khi ext đang chạy · false: xoá khi đang tắt
const DELETE_TWICE = true; // thử xoá lần 2 → xem app báo gì
const LOOK_SECONDS = 0; // đặt 15 để dừng lại, bạn tự mở thư mục thật xem trước khi xoá
// =========================================================

const fs = require("fs");
const path = require("path");
const { createWorld } = require("./_env");
const { step, say, sleep } = require("./_show");

const readJson = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return {};
  }
};

// In những gì đang nằm THẬT trên đĩa, chỉ lọc ra phần của 2 ext test.
async function showDisk({ world, ids }) {
  await world.flush();
  const mine = (key) =>
    ids.some((id) => key === id || key.startsWith(`${id}.`));
  const list = (keys) => keys.filter(mine).join(", ") || "(không có)";
  const dir = path.join(world.home, "extensions");
  const keysOf = (name) => Object.keys(readJson(path.join(world.home, name)));
  say(
    `thư mục extensions/ : ${list(fs.existsSync(dir) ? fs.readdirSync(dir) : [])}`,
  );
  say(`extensions.json     : ${list(keysOf("extensions.json"))}`);
  say(`settings.json       : ${list(keysOf("settings.json"))}`);
  say(
    `Settings đang hiện nhóm của: ${
      world.source
        .list()
        .map((s) => s.from)
        .join(", ") || "(không có)"
    }`,
  );
}

async function stepSetup({ world }) {
  step("1. Chuẩn bị: tạo 2 ext, bật ext 1, user chỉnh setting của cả 2");
  say(`thư mục thật: ${world.home}`);
  const { usecases, settingsStore } = world;
  const a = await usecases.create({ name: EXT_NAME });
  const b = await usecases.create({ name: OTHER_NAME });
  say(`"${EXT_NAME}" → id "${a.id}"   |   "${OTHER_NAME}" → id "${b.id}"`);
  await usecases.save({ id: a.id, code: a.sample });
  if (ENABLE_FIRST) await usecases.setEnabled({ id: a.id, enabled: true });
  say(`ext 1 đang: ${world.view(a.id).status}`);
  for (const { id } of [a, b]) {
    settingsStore.set({ key: `${id}.seconds`, value: 2, scope: "global" });
  }
  say(
    "user đã chọn 2 giây cho cả 2 ext (khác mặc định 5 nên được lưu xuống đĩa)",
  );
  return [a.id, b.id];
}

async function stepDelete({ world, ids }) {
  const [id] = ids;
  step(`3. User bấm xoá ext 1 ("${id}")`);
  const before = world.changes();
  await world.usecases.remove({ id });
  say(
    `đã xoá. Sidebar được báo thay đổi: ${world.changes() > before ? "có" : "không"}`,
  );
  await showDisk({ world, ids });
}

async function stepTwice({ world, id }) {
  step("4. User xoá lại ext 1 lần nữa");
  await world.usecases.remove({ id }).then(
    () => say("app không báo lỗi"),
    (error) => say(`app báo lỗi: ${error.message}`),
  );
}

// Dù test dừng giữa chừng, ext test không được nằm lại trong thư mục thật.
async function sweep({ world, ids }) {
  const left = world.usecases.list().filter((row) => ids.includes(row.id));
  for (const { id } of left)
    await world.usecases.remove({ id }).catch(() => {});
}

async function main() {
  const world = createWorld({ real: true });
  let ids = [];
  try {
    ids = await stepSetup({ world });
    step("2. Trên đĩa thật lúc này");
    await showDisk({ world, ids });
    if (LOOK_SECONDS) {
      say(`⏸ dừng ${LOOK_SECONDS}s, bạn mở ${world.home} để xem`);
      await sleep(LOOK_SECONDS * 1000);
    }
    await stepDelete({ world, ids });
    if (DELETE_TWICE) await stepTwice({ world, id: ids[0] });
  } catch (error) {
    console.error("\n💥 Test dừng vì lỗi bất ngờ:", error.stack);
    process.exitCode = 1;
  } finally {
    await sweep({ world, ids });
    step("Dọn dẹp: ext 2 cũng được xoá để thư mục thật không còn gì của test");
    await world.cleanup({ keep: false });
  }
}

main();