// _show.js — 3 hàm in cho dễ đọc.

const step = (title) => console.log(`\n━━ ${title}`);
const say = (text = "") => console.log(`   ${text}`);
const json = (value) =>
  JSON.stringify(value, null, 2)
    .split("\n")
    .forEach((line) => say(line));

module.exports = { step, say, json };
