// run-store.js
// CRUD trạng thái chạy (run) — lưu <project>/.vibe/workflow/runs/<runId>.json.
// Tách khỏi install.js: run là trạng thái TẠM THỜI theo lần chạy, khác với
// workflow definition (snapshot cố định).

const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { getProjectPath } = require("../install/install");

function runsDir(projectPath) {
  return path.join(projectPath, ".vibe", "workflow", "runs");
}

function runFile(projectPath, runId) {
  return path.join(runsDir(projectPath), `${runId}.json`);
}

function create(workflowId, sessionId) {
  const projectPath = getProjectPath();
  if (!projectPath) throw new Error("Chưa mở project nào.");
  const runId = crypto.randomUUID();
  const run = {
    runId,
    workflowId,
    sessionId,
    currentIndex: 0,
    stepResults: [],
  };
  fs.mkdirSync(runsDir(projectPath), { recursive: true });
  fs.writeFileSync(
    runFile(projectPath, runId),
    JSON.stringify(run, null, 2),
    "utf-8",
  );
  return run;
}

function get(runId) {
  const projectPath = getProjectPath();
  if (!projectPath) return null;
  try {
    return JSON.parse(fs.readFileSync(runFile(projectPath, runId), "utf-8"));
  } catch {
    return null;
  }
}

function save(run) {
  const projectPath = getProjectPath();
  if (!projectPath) throw new Error("Chưa mở project nào.");
  fs.writeFileSync(
    runFile(projectPath, run.runId),
    JSON.stringify(run, null, 2),
    "utf-8",
  );
  return run;
}

module.exports = { create, get, save };
