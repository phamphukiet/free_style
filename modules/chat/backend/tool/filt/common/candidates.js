// candidates.js
// Danh sách lệnh ứng viên: lọc bus.list() theo mode, chỉ lấy lệnh "đơn giản"
// (≤ maxArgs tham số, kiểu string/number/boolean). Require lười để test chạy bằng node thuần.

const { toSchema } = require("../../../../../../shared/command/args.js");
const { modulesOfMode } = require("../../modes");

const SIMPLE = new Set(["string", "number", "boolean"]);

const busList = () =>
  require("../../../../../../shared/command").getBus().list();

const sameCommand = (a, b) => a.module === b.module && a.name === b.name;

function isSimple({ command, maxArgs }) {
  const specs = Object.values(toSchema(command.args));
  return (
    specs.length <= maxArgs && specs.every((spec) => SIMPLE.has(spec.type))
  );
}

/** @param {{ mode: string, only?: object[]|null, maxArgs?: number, list?: () => object[] }} args */
function candidatesOf({
  mode,
  only = null,
  maxArgs = Infinity,
  list = busList,
}) {
  const modules = modulesOfMode(mode);
  const found = list().filter(
    (command) =>
      modules.includes(command.module) && isSimple({ command, maxArgs }),
  );
  if (!only) return found;
  return found.filter((c) => only.some((ref) => sameCommand(c, ref)));
}

module.exports = { candidatesOf, sameCommand };
