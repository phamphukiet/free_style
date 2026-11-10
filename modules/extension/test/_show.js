// _show.js
// Đồ nghề "cho nhìn thấy" của các file test: tiêu đề bước, in có thụt lề, in code kèm số dòng,
// vẽ lại ô trong Settings, chờ có timeout, theo dõi ext phát lệnh theo thời gian thực.

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const step = (title) => console.log(`\n━━ ${title}`);
const say = (text = "") => console.log(`   ${text}`);
const json = (value) =>
  String(JSON.stringify(value, null, 2))
    .split("\n")
    .forEach((line) => say(line));

function code(text) {
  if (!text) return say("(file rỗng)");
  text
    .trimEnd()
    .split("\n")
    .forEach((line, i) => say(`${String(i + 1).padStart(2)} │ ${line}`));
}

// Vẽ lại ô nhập như user sẽ thấy trong Settings.
function draw(def, value) {
  if (def.control === "switch") return `${value ? "[x]" : "[ ]"} ${def.label}`;
  if (def.control !== "dropdown") return `${def.label}: [ ${value} ]`;
  const list = def.options.map((option) => option.value).join(" | ");
  return `${def.label}: [ ${value} ▾ ]   (gồm: ${list})`;
}

async function waitFor(
  condition,
  { timeout = 3000, interval = 100, onTick = () => {} } = {},
) {
  const end = Date.now() + timeout;
  for (;;) {
    onTick();
    if (condition()) return true;
    if (Date.now() > end) return false;
    await sleep(interval);
  }
}

// Theo dõi mảng `sent` (lệnh ext đã phát): in từng lệnh ngay khi nó xuất hiện, kèm mốc thời gian.
async function watchSent({ sent, count, timeout }) {
  const from = sent.length;
  const t0 = Date.now();
  let shown = from;
  let tick = 0;
  const secs = (ms) => (ms / 1000).toFixed(2);

  const onTick = () => {
    const sec = Math.floor((Date.now() - t0) / 1000);
    if (sec > tick) say(`+${(tick = sec)}s  · đang chờ…`);
    for (; shown < sent.length; shown++) {
      const { at, module, name } = sent[shown];
      const first = shown === from;
      const gap = at - (first ? t0 : sent[shown - 1].at);
      const label = first ? "sau khi user chọn" : "cách lần trước";
      say(`+${secs(at - t0)}s  📨 ${module}.${name}  (${label} ${secs(gap)}s)`);
    }
  };

  const got = await waitFor(() => sent.length - from >= count, {
    timeout,
    onTick,
  });
  if (!got)
    say(
      `⚠ hết ${timeout / 1000}s mà mới thấy ${sent.length - from}/${count} lệnh`,
    );
}

module.exports = { sleep, step, say, json, code, draw, waitFor, watchSent };