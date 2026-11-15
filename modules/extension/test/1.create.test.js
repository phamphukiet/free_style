// 1.create.test.js
// Kịch bản: user tạo ext "Tự động lưu", dán code mẫu, bật lên, chọn thời gian trong dropdown.
// File này KHÔNG chấm đạt/không đạt: nó in ra những gì thật sự diễn ra để bạn tự quan sát.
// Chạy (ở thư mục gốc project):  node modules/extension/test/1.create.test.js

// ===== THỬ CÁC CASE KHÁC: chỉ cần sửa các hằng số này =====
const EXT_NAME = "Auto Save"; // thử: "Tự động lưu" · "123" · "editor" (trùng tên module)
const SECONDS = 2; // lựa chọn trong dropdown: 2, 5 hoặc 30 (thử 7 = không có trong dropdown)
const THEN_SECONDS = 5; // user đổi dropdown lần nữa khi ext đang chạy; null = không đổi
const SAVES = 2; // quan sát bao nhiêu lần lưu ở mỗi mức
const KEEP_TEMP = false; // true: giữ thư mục tạm để mở xem file thật
// =========================================================

const fs = require("fs");
const { createWorld } = require("./_env");
const { step, say, code, json, draw, watchSent } = require("./_show");
const { checkManifest } = require("../../settings/backend/manifest/guard");

const find = (manifest, key) =>
  manifest.settings.find((def) => def.id.endsWith(`.${key}`));

async function stepCreate({ usecases }) {
  step("1. User bấm “+” và nhập tên");
  const created = await usecases.create({ name: EXT_NAME });
  say(`tên nhập: "${EXT_NAME}"  →  id: "${created.id}"`);
  say(`file code: ${created.file}`);
  say("nội dung file lúc mới tạo:");
  code(fs.readFileSync(created.file, "utf-8"));
  say("trạng thái lưu trong extensions.json:");
  json(usecases.list().find((row) => row.id === created.id).record);
  return created;
}

async function stepPaste({ world, created }) {
  step("2. User copy code mẫu, dán vào file rồi lưu");
  code(created.sample);
  await world.usecases.save({ id: created.id, code: created.sample });
  say("app đọc lại code và hiểu được:");
  json(world.view(created.id));
  say(
    `mục setting đang hiện trong Settings: ${world.source.list().length} (ext còn tắt)`,
  );
}

async function stepEnable({ world, id }) {
  step("3. User gạt công tắc bật ext");
  await world.usecases.setEnabled({ id, enabled: true });
  say(`trạng thái ext: ${world.view(id).status}`);
  const { manifest } = world.source.list()[0];
  say("Settings hiện ra như sau:");
  manifest.settings.forEach((def) => say(`  ${draw(def, def.default)}`));
  say("khai báo thật Settings nhận cho ô dropdown:");
  json(find(manifest, "seconds"));
  const verdict = checkManifest({ manifest, trusted: false });
  say(
    verdict.ok
      ? "Settings kiểm tra: chấp nhận"
      : `Settings kiểm tra: TỪ CHỐI → ${verdict.error}`,
  );
  return manifest;
}

async function stepTurnOn({ world, manifest }) {
  step("4. User bật công tắc “Bật tự động lưu”");
  const def = find(manifest, "enabled");
  say(draw(def, true));
  await world.settings.choose({ id: def.id, value: true });
  say(
    "ext chạy lại với enabled = true; dropdown chưa chọn nên đang dùng giá trị mặc định",
  );
}

async function stepChoose({ world, id, manifest, seconds, n }) {
  step(`${n}. User chọn ${seconds} giây trong dropdown`);
  const def = find(manifest, "seconds");
  const known = def.options.some((option) => option.value === seconds);
  say(
    draw(def, seconds) +
      (known ? "" : "   ⚠ giá trị này không có trong dropdown"),
  );
  await world.settings.choose({ id: def.id, value: seconds });
  say(`ext chạy lại với giá trị mới, trạng thái: ${world.view(id).status}`);
  const timeout = seconds * 1000 * SAVES + 3000;
  await watchSent({ sent: world.commandsSent, count: SAVES, timeout });
}

function stepEnd({ commandsSent }) {
  step("Kết thúc");
  const { at, ...payload } = commandsSent.at(-1) ?? {};
  say(
    `tổng số lệnh ext đã phát: ${commandsSent.length}. Renderer nhận được mỗi lần:`,
  );
  json(payload);
}

async function main() {
  const world = createWorld();
  try {
    const created = await stepCreate(world);
    await stepPaste({ world, created });
    const { id } = created;
    const ctx = { world, id, manifest: await stepEnable({ world, id }) };
    await stepTurnOn(ctx);
    const picks = [SECONDS, THEN_SECONDS].filter(Boolean);
    for (const [i, seconds] of picks.entries())
      await stepChoose({ ...ctx, seconds, n: 5 + i });
    stepEnd(world);
  } catch (error) {
    console.error("\n💥 Test dừng vì lỗi bất ngờ:", error.stack);
    process.exitCode = 1;
  } finally {
    await world.cleanup({ keep: KEEP_TEMP });
  }
}

main();
