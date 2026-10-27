const fs = require("fs");
const path = require("path");
const { THEME_TARGET } = require("./target");

const DIR = path.join(__dirname, "../../frontend/theme");
const idOf = (file) => file.replace(/\.json$/, "");

const options = fs
  .readdirSync(DIR)
  .filter((f) => f.endsWith(".json"))
  .sort()
  .map((file) => {
    const { label } = JSON.parse(
      fs.readFileSync(path.join(DIR, file), "utf-8"),
    );
    return { value: idOf(file), label: label || idOf(file) };
  });

module.exports = [
  {
    id: "terminal.colorTheme",
    group: "Terminal",
    label: "Color Theme",
    type: "select",
    default: "dark",
    options,
    order: 5,
    effects: [{ target: THEME_TARGET, payload: { base: "$value" } }],
  },
];
