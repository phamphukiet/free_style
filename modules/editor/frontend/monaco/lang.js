const LANGS = {
  js: "javascript",
  ts: "typescript",
  json: "json",
  html: "html",
  css: "css",
  py: "python",
  md: "markdown",
};

export const detectLang = (path) =>
  LANGS[path.split(".").pop().toLowerCase()] || "plaintext";
