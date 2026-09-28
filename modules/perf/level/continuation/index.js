// index.js
const { runWithContinuation } = require("./resume");
const { buildContinuationGuide } = require("./prompt");
const {
  registerCapability,
} = require("../../../../shared/capability-registry");
const {
  registerPromptContributor,
} = require("../../../../shared/chat-pipeline-registry");

function register() {
  registerPromptContributor(
    "continuation-guide",
    () => buildContinuationGuide(),
    30,
  );
  registerCapability({
    id: "continuation",
    kind: "service",
    api: { runWithContinuation, buildContinuationGuide },
  });
}

module.exports = { runWithContinuation, buildContinuationGuide, register };