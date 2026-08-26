// npm.js
// Adapter search cho npm Registry (API JSON thật) — KHÔNG nhầm với
// npmjs.com (trang web, chặn bot 403). 2 domain khác nhau hoàn toàn.

const NPM_PLATFORM = {
  id: "npm",
  name: "npm Registry",
  type: "npm",
  endpoint: "https://registry.npmjs.org",
};

function isNpmInput(raw) {
  const v = raw
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  return (
    v === "npm" ||
    v === "npmjs" ||
    v.includes("npmjs.com") ||
    v.includes("registry.npmjs.org")
  );
}

async function searchNpm(query) {
  const q = query || "skill";
  const url = `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(q)}&size=20`;
  const res = await fetch(url);
  if (!res.ok) return [];

  const data = await res.json();
  return (data.objects || []).map(({ package: p }) => ({
    id: `npm:${p.name}`,
    platformId: "npm",
    name: p.name,
    sourceUrl: p.links?.npm || `https://www.npmjs.com/package/${p.name}`,
    // Đoán vị trí SKILL.md ở gốc package qua unpkg — không đảm bảo tồn tại,
    // giống cách github.js đoán nhánh mặc định.
    contentUrl: `https://unpkg.com/${p.name}/SKILL.md`,
    version: p.version || null,
    rating: null,
    downloads: null,
    installOptions: null,
  }));
}

module.exports = { NPM_PLATFORM, isNpmInput, searchNpm };
