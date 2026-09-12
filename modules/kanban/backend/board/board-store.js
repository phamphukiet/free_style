// board-store.js
// CRUD board + tasks, lưu 1 file tại <project>/.vibe/kanban/board.json.
// 1 project = 1 board — không cần catalog/manifest như workflow cũ.

const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { readState } = require("../../../../src/main/state");
const { broadcastKanbanChanged } = require("./notify");

const MAX_DONE_KEPT = 20;

function getProjectPath() {
  const { lastFolder } = readState();
  if (!lastFolder || !fs.existsSync(lastFolder)) return null;
  return lastFolder;
}

function boardFile(projectPath) {
  return path.join(projectPath, ".vibe", "kanban", "board.json");
}

function emptyBoard() {
  return { name: "Board", tasks: {}, maxDoneKept: MAX_DONE_KEPT };
}

function readBoard() {
  const projectPath = getProjectPath();
  if (!projectPath) return null;
  try {
    return JSON.parse(fs.readFileSync(boardFile(projectPath), "utf-8"));
  } catch {
    return emptyBoard();
  }
}

function writeBoard(board) {
  const projectPath = getProjectPath();
  if (!projectPath) throw new Error("Chưa mở project nào.");
  const file = boardFile(projectPath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(board, null, 2), "utf-8");
  broadcastKanbanChanged();
  return board;
}

function listTasks() {
  const board = readBoard();
  return board ? Object.values(board.tasks) : [];
}

function getTask(id) {
  return readBoard()?.tasks[id] || null;
}

function createTask({ title, description = "", agentId = "" }) {
  const board = readBoard() || emptyBoard();
  const id = crypto.randomUUID();
  const now = Date.now();
  const task = {
    id,
    title,
    description,
    agentId,
    columnId: "ALL",
    order: now,
    result: null,
    running: false,
    sessionId: "",
    history: [{ at: now, from: null, to: "ALL", actor: "user" }],
    createdAt: now,
    updatedAt: now,
  };
  board.tasks[id] = task;
  writeBoard(board);
  return task;
}

function saveTask(task) {
  const board = readBoard() || emptyBoard();
  task.updatedAt = Date.now();
  board.tasks[task.id] = task;
  writeBoard(board);
  return task;
}

function removeTask(id) {
  const board = readBoard();
  if (!board?.tasks[id]) return false;
  delete board.tasks[id];
  writeBoard(board);
  return true;
}

module.exports = {
  getProjectPath,
  readBoard,
  writeBoard,
  listTasks,
  getTask,
  createTask,
  saveTask,
  removeTask,
};
