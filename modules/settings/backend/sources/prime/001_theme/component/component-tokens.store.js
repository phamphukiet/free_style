const { app } = require("electron");
const path = require("path");
const fs = require("fs");

const FILE = path.join(app.getPath("userData"), "component-tokens.json");

function readOverrides() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return {};
  }
}
function writeOverrides(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf-8");
}

module.exports = { readOverrides, writeOverrides };
