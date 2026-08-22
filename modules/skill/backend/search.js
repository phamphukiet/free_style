// search.js
// Gộp kết quả: catalog đã lưu (local) + tìm trực tiếp trên các nền tảng đã kết nối.
// Dedupe theo sourceUrl, sort mặc định theo rating.

const platformsStore = require("./platforms-store");
const skillsStore = require("./skills-store");
const { searchOnPlatform } = require("./connector");

function matchLocal(skill, query) {
  const q = query.toLowerCase();
  return skill.name.toLowerCase().includes(q);
}

function dedupe(items) {
  const seen = new Map();
  for (const item of items) {
    if (!seen.has(item.sourceUrl)) seen.set(item.sourceUrl, item);
  }
  return [...seen.values()];
}

function sortResults(items, sortBy) {
  const key = sortBy === "downloads" ? "downloads" : "rating";
  return [...items].sort((a, b) => (b[key] ?? -1) - (a[key] ?? -1));
}

async function searchAll(query, sortBy = "rating") {
  const local = query
    ? skillsStore.list().filter((s) => matchLocal(s, query))
    : skillsStore.list();

  if (!query) return sortResults(local, sortBy);

  const platforms = platformsStore.list();
  const remoteLists = await Promise.all(
    platforms.map((p) => searchOnPlatform(p, query)),
  );
  const merged = dedupe([...local, ...remoteLists.flat()]);
  return sortResults(merged, sortBy);
}

module.exports = { searchAll };
