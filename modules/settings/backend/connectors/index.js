// index.js
// Gom connector. Mọi connector ghi qua engine.set → vẫn validate + phát event.

const { createFileLink } = require("./file-link");
const { importVscode } = require("./vscode-import");

/** @param {{ engine: object, store: object }} deps  store: namespace "settings-links" */
function createConnectors({ engine, store }) {
  const link = createFileLink({ engine, store });
  link.restore();
  return {
    importVscode: ({ file, text } = {}) =>
      importVscode({ set: engine.set, file, text }),
    linkFile: ({ file }) => link.link({ file }),
    unlinkFile: () => link.unlink(),
    linkStatus: () => link.status(),
  };
}

module.exports = { createConnectors };
