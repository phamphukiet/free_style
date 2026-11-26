// format.js
// Dòng log theo rule.md: [task - 'module' - 'file']: message

/** @param {{ task: string, module: string, file: string, message: string }} args */
const toLine = ({ task, module, file, message }) =>
  `[${task} - '${module}' - '${file}']: ${message}`;

module.exports = { toLine };
