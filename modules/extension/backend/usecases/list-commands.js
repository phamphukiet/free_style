// list-commands.js — UC12: danh sách command ext có thể gọi.

function createListCommands({ commandBus }) {
  return () => commandBus.list();
}

module.exports = { createListCommands };
