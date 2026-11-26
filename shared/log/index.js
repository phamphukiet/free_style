// index.js
// Điểm vào duy nhất: createLog({ filename, topic? }) → { say }.
// say({ task, message?, run?, fallback? }):
//   - ghi dòng task (qua đóng băng + tiêu điểm)
//   - có run: chạy run như try/catch; lỗi ghi "[Error - 'module' - 'file']: <lỗi>" rồi trả fallback
// topic mặc định = tên module; chỉ file thuộc luồng chéo module mới khai báo topic riêng.

const activeModules = require("../../modules/active-modules.js");
const { whereOf } = require("./where");
const { canSay, canFail } = require("./gate");
const { toLine } = require("./format");
const { consoleSink } = require("./sink");
const { focusOf } = require("./config");
const { attempt } = require("./attempt");

const ERROR_TASK = "Error";
const NOOP = () => undefined;
const messageOf = (error) => error?.message ?? String(error);

/** @param {{ filename: string, topic?: string, sink?: object, active?: string[], focus?: string[]|null }} args */
function createLog({
  filename,
  topic,
  sink = consoleSink,
  active = activeModules,
  focus = focusOf(),
}) {
  const where = whereOf({ filename });
  const gate = {
    owner: where.owner,
    topic: topic ?? where.module,
    active,
    focus,
  };
  const line = ({ task, message }) =>
    toLine({ task, module: where.module, file: where.file, message });

  const report = ({ task, message }) =>
    canSay(gate) && sink.say(line({ task, message }));
  const reportError = (error) =>
    canFail(gate) &&
    sink.fail(line({ task: ERROR_TASK, message: messageOf(error) }));

  function say({ task, message = "", run = NOOP, fallback }) {
    report({ task, message });
    return attempt({ run, fallback, onError: reportError });
  }

  return { say };
}

module.exports = { createLog };
