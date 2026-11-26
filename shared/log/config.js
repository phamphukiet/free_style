// config.js
// Profile tiêu điểm: VIBE_LOG=<tên profile> hoặc VIBE_LOG=topicA,topicB.
// Không đặt VIBE_LOG thì không lọc theo topic (chỉ còn lớp đóng băng module).

const PROFILES = new Map([
  ["settingsPrompt", ["command", "settings"]],
  ["extensionPrompt", ["command", "extension"]],
]);
const parse = (raw) =>
  PROFILES.get(raw) ??
  raw
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

/** @param {{ env?: object }} args */
const focusOf = ({ env = process.env } = {}) =>
  env.VIBE_LOG ? parse(env.VIBE_LOG) : null;

module.exports = { PROFILES, focusOf };
