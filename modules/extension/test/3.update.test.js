// 3.update.test.js
// Kịch bản: user có ext Auto Save (chọn thời gian), rồi sửa code thành dropdown "chế độ lưu".
// Dùng thư mục THẬT (~/.vibe) và KHÔNG xoá ext → ĐÓNG APP trước khi chạy.
// Chạy:  node modules/extension/test/3.update.test.js   rồi gõ 1 hoặc 2

// ===== THỬ CÁC CASE KHÁC: chỉ cần sửa các hằng số này =====
const CHOICE = ""; // "" = hỏi ở terminal · "1" hoặc "2" = chọn sẵn, không hỏi
const EXT_NAME = "Auto Save Test"; // id sẽ là "auto-save-test"
const SECONDS = 2; // (chọn 1) chu kỳ lưu của bản cơ bản: 2, 5 hoặc 30
const TRY_MODES = ["interval", "on-close"]; // (chọn 2) lần lượt chọn: interval · on-close · on-switch · off
const WATCH_SECONDS = 6; // mỗi lần chọn, quan sát ext bao lâu
// =========================================================

const fs = require("fs");
const path = require("path");
const { createWorld } = require("./_env");
const { slug } = require("../backend/domain/ext-id");
const { step, say, code, draw, sleep } = require("./_show");

const NEW_CODE = fs.readFileSync(
  path.join(__dirname, "samples", "auto-save-modes.js"),
  "utf-8",
);

async function ask(question) {
  const rl = require("readline/promises").createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const answer = await rl.question(question);
  rl.close();
  return answer.trim();
}

const exists = ({ world, id }) =>
  world.usecases.list().some((row) => row.id === id);
const basicCode = ({ world }) =>
  world.usecases.languages().find((lang) => lang.id === "js").sample;
const defOf = ({ world, id, key }) =>
  world.source
    .list()
    .find((s) => s.from === id)
    ?.manifest.settings.find((d) => d.id === `${id}.${key}`);

// Giống user chọn trong Settings: lưu thật xuống ~/.vibe/settings.json + báo cho ext đang chạy.
async function pick({ world, id, key, value }) {
  const settingId = `${id}.${key}`;
  world.settingsStore.set({ key: settingId, value, scope: "global" });
  await world.settings.choose({ id: settingId, value });
}

async function showSaved({ world, id }) {
  await world.flush();
  let saved = {};
  try {
    saved = JSON.parse(
      fs.readFileSync(path.join(world.home, "settings.json"), "utf-8"),
    );
  } catch {
    /* chưa có file */
  }
  const mine = Object.entries(saved).filter(([key]) =>
    key.startsWith(`${id}.`),
  );
  say(
    `settings.json đang lưu: ${mine.map(([k, v]) => `${k} = ${v}`).join(" | ") || "(không có)"}`,
  );
}

async function watch({ world, seconds }) {
  const from = world.commandsSent.length;
  const t0 = Date.now();
  await sleep(seconds * 1000);
  const got = world.commandsSent.slice(from);
  say(
    `quan sát ${seconds}s: ${got.length === 0 ? "ext không gửi lệnh nào" : `${got.length} lệnh`}`,
  );
  got.forEach(({ at, module, name }) =>
    say(`  +${((at - t0) / 1000).toFixed(2)}s  📨 ${module}.${name}`),
  );
}

async function basic({ world, id }) {
  step("Tạo auto save cơ bản (dropdown chọn thời gian)");
  const had = exists({ world, id });
  if (!had) await world.usecases.create({ name: EXT_NAME });
  say(
    had
      ? `ext "${id}" đã có sẵn → đưa code về bản cơ bản`
      : `đã tạo ext mới, id "${id}"`,
  );
  await world.usecases.save({ id, code: basicCode({ world }) });
  await world.usecases.setEnabled({ id, enabled: true });
  await pick({ world, id, key: "enabled", value: true });
  await pick({ world, id, key: "seconds", value: SECONDS });
  say(`file: ${world.view(id).file}`);
  say(`trạng thái: ${world.view(id).status}`);
  await showSaved({ world, id });
  await watch({ world, seconds: WATCH_SECONDS });
}

async function update({ world, id }) {
  if (!exists({ world, id }))
    return say(`chưa có ext "${id}" → chạy lại và chọn 1 trước`);
  step("1. Trước khi update");
  say(`code hiện có trong ${world.view(id).file}:`);
  code(fs.readFileSync(world.view(id).file, "utf-8"));
  await showSaved({ world, id });

  step("2. User dán code mới (dropdown chế độ lưu) rồi lưu");
  code(NEW_CODE);
  await world.usecases.save({ id, code: NEW_CODE });
  if (world.view(id).status !== "running")
    await world.usecases.setEnabled({ id, enabled: true });
  const shown = world.view(id);
  say(`trạng thái: ${shown.status}${shown.error ? ` — ${shown.error}` : ""}`);
  const mode = defOf({ world, id, key: "mode" });
  if (!mode)
    return say("Settings chưa nhận được setting “mode”, xem lỗi ở trên");
  say("Settings hiện ra:");
  say(`  ${draw(mode, mode.default)}`);
  mode.options.forEach((o) => say(`    ${o.value} → ${o.label}`));
  await showSaved({ world, id });

  for (const [i, value] of TRY_MODES.entries()) {
    step(`${3 + i}. User chọn "${value}" trong dropdown`);
    await pick({ world, id, key: "mode", value });
    say(draw(mode, value));
    await watch({ world, seconds: WATCH_SECONDS });
  }
  step("Kết thúc");
  say(`ext "${id}" vẫn nằm trong ${world.home}`);
}

async function main() {
  const choice =
    CHOICE ||
    (await ask(
      "1: tạo auto save cơ bản\n2: update sang dropdown chế độ lưu\nChọn (1/2): ",
    ));
  if (!["1", "2"].includes(choice))
    return console.log(`"${choice}" không hợp lệ, chỉ nhận 1 hoặc 2`);
  const world = createWorld({ real: true });
  try {
    await (choice === "1" ? basic : update)({ world, id: slug(EXT_NAME) });
  } catch (error) {
    console.error("\n💥 Test dừng vì lỗi bất ngờ:", error.stack);
    process.exitCode = 1;
  } finally {
    await world.cleanup({ keep: false }); // thư mục thật: chỉ đóng storage, không xoá gì
  }
}

main();