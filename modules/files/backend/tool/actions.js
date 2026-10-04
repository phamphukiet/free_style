// actions.js — điểm gom action của tool files; logic thật ở tree/read/write/move.

const { tree } = require("./tree.js");
const { read } = require("./read.js");
const { write, remove } = require("./write.js");
const { move } = require("./move.js");

module.exports = { tree, read, write, remove, move };
