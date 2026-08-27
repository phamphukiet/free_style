// github.js
// Adapter tìm kiếm skill trên GitHub — dùng GitHub REST Search API, KHÔNG
// cần endpoint tuỳ chỉnh vì API cố định. rating = số star (đúng ý "đánh giá
// từ web"), downloads = số fork (GitHub không có "lượt tải" repo, dùng fork
// làm proxy độ phổ biến — gần nghĩa nhất hiện có).
const { downloadGithubFiles } = require("./github-download");

const GITHUB_PLATFORM = {
  id: "github",
  name: "GitHub",
  type: "github",
  endpoint: "https://api.github.com",
};

// Nhận diện input người dùng gõ: "github", "github.com", có/không "https://"
function isGithubInput(raw) {
  const v = raw
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  return v === "github" || v === "github.com" || v.startsWith("github.com");
}

// query rỗng → vẫn trả gợi ý chung (tìm "skill"); có query → ghép thêm để
// GitHub match gần đúng trên tên/mô tả/README repo.
async function searchGithub(query) {
  const q = query ? `${query} skill` : "skill";
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=20`;

  const res = await fetch(url, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) return []; // rate-limit / lỗi mạng → coi như nền tảng này không có kết quả, không chặn nền tảng khác

  const data = await res.json();
  return (data.items || []).map((repo) => ({
    id: repo.full_name,
    platformId: "github",
    name: repo.name,
    sourceUrl: repo.html_url,
    contentUrl: `https://raw.githubusercontent.com/${repo.full_name}/${repo.default_branch}/SKILL.md`,
    defaultBranch: repo.default_branch,
    version: null,
    rating: repo.stargazers_count,
    downloads: repo.forks_count,
    installOptions: null,
  }));
}

async function resolveContentUrl(skill) {
  const fullName = skill.id;
  const branch = skill.defaultBranch || "main";
  const guessed = `https://raw.githubusercontent.com/${fullName}/${branch}/SKILL.md`;

  const head = await fetch(guessed, { method: "HEAD" });
  if (head.ok) return guessed;

  const searchUrl = `https://api.github.com/search/code?q=filename:SKILL.md+repo:${fullName}`;
  const res = await fetch(searchUrl, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (res.status === 403) {
    throw new Error("GitHub giới hạn tốc độ tìm kiếm, thử lại sau ít phút.");
  }
  if (!res.ok) return null;

  const data = await res.json();
  const path = data.items?.[0]?.path;
  return path
    ? `https://raw.githubusercontent.com/${fullName}/${branch}/${path}`
    : null;
}

module.exports = {
  GITHUB_PLATFORM,
  isGithubInput,
  searchGithub,
  resolveContentUrl,
  downloadFiles: downloadGithubFiles
};