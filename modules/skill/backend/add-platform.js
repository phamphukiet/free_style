// add-platform.js
// Thêm 1 NỀN TẢNG tìm kiếm skill — không phải link nội dung 1 skill cụ thể.
// GitHub: nhận diện qua từ khoá, dùng API cố định, không cần test endpoint.
// Nền tảng khác: coi input là base URL tuỳ chỉnh theo quy ước {endpoint}/search?q=.

const platformsStore = require("./platforms-store");
const { testConnection } = require("./connector");
const { isGithubInput, GITHUB_PLATFORM } = require("./platforms/github");

function normalizeInput(raw) {
  const input = raw.trim();
  if (isGithubInput(input)) return { ...GITHUB_PLATFORM };

  const endpoint = /^https?:\/\//.test(input) ? input : `https://${input}`;
  let hostname;
  try {
    hostname = new URL(endpoint).hostname;
  } catch {
    throw new Error("Link không hợp lệ");
  }
  return { id: endpoint, name: hostname, endpoint, type: "generic" };
}

async function addPlatform(raw) {
  const def = normalizeInput(raw);
  if (def.type !== "github") {
    const result = await testConnection(def.endpoint);
    if (!result.success) throw new Error(result.message);
  }
  return platformsStore.save(def);
}

module.exports = { addPlatform };
