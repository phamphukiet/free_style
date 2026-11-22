// index.js
const path = require("path");
const activeModules = require("../../modules/active-modules.js");
const { broadcast } = require("../ipc/broadcast.js");
const { scanCommands } = require("./scan");
const { createCommandBus } = require("./bus");

const MODULES_DIR = path.join(__dirname, "..", "..", "modules");
let bus = null;

const getBus = () =>
  (bus ??= createCommandBus({
    scan: () => scanCommands({ activeModules, modulesDir: MODULES_DIR }),
    send: broadcast,
  }));

module.exports = { getBus };
