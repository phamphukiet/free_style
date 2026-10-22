// extensions-dir.js
// Quét ~/.vibe/extensions/<ext-id>/manifest.json (chỉ dữ liệu, không code).
// KHÔNG nạp extension trong <project>/.vibe để tránh tự tin nội dung bị commit theo project.

const fs = require("fs");
const path = require("path");

function readOne({ dir, name }) {
  const file = path.join(dir, name, "manifest.json");
  if (!fs.existsSync(file)) return null;
  try {
    return { from: name, manifest: JSON.parse(fs.readFileSync(file, "utf-8")) };
  } catch (error) {
    return { from: name, error: error.message };
  }
}

function createExtensionsSource({ extensionsDir }) {
  return {
    id: "extension",
    trusted: false,
    list() {
      if (!fs.existsSync(extensionsDir)) return [];
      return fs
        .readdirSync(extensionsDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => readOne({ dir: extensionsDir, name: entry.name }))
        .filter(Boolean);
    },
  };
}

module.exports = { createExtensionsSource };