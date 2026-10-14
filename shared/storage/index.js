// index.js
// Điểm vào duy nhất: module chỉ cần require("shared/storage").
const { registry, createRegistry } = require("./registry/registry");
const { createStorage } = require("./core/storage");

module.exports = { registry, createRegistry, createStorage };