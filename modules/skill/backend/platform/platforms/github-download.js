// github-download.js
// Tải NGUYÊN thư mục repo qua Git Trees API (recursive) — thay vì đoán 1 file
// SKILL.md như trước. Tách riêng để github.js không phình quá 100 dòng.

async function fetchTree(fullName, branch) {
  const url = `https://api.github.com/repos/${fullName}/git/trees/${branch}?recursive=1`;
  const res = await fetch(url, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (res.status === 403)
    throw new Error("GitHub giới hạn tốc độ, thử lại sau ít phút.");
  if (!res.ok)
    throw new Error(`Không đọc được cây thư mục repo (${res.status})`);
  const data = await res.json();
  if (data.truncated)
    console.warn(
      `[skill] Repo "${fullName}" quá lớn, danh sách file có thể bị cắt bớt.`,
    );
  return (data.tree || []).filter((n) => n.type === "blob");
}

async function fetchBlob(fullName, branch, filePath) {
  const url = `https://raw.githubusercontent.com/${fullName}/${branch}/${filePath}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Tải file lỗi: ${filePath} (${res.status})`);
  return Buffer.from(await res.arrayBuffer());
}

async function downloadGithubFiles(skill) {
  const fullName = skill.id;
  const branch = skill.defaultBranch || "main";
  const nodes = await fetchTree(fullName, branch);
  return Promise.all(
    nodes.map(async (n) => ({
      relPath: n.path,
      content: await fetchBlob(fullName, branch, n.path),
    })),
  );
}

module.exports = { downloadGithubFiles };
