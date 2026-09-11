// run-step.js
// Thực thi 1 step: dispatch sang tool bridge có sẵn (rule/skill/agent/files)
// qua executeAiTool — KHÔNG require trực tiếp module khác, đúng plugin pattern.

const { executeAiTool } = require("../../../chat/backend/send/ai-tools");
const { resolveArgs } = require("./resolve-args");
const runStore = require("./run-store");
const workflowStore = require("../catalog/workflow-store");

function getSteps(workflowId) {
  const workflow = workflowStore.get(workflowId);
  if (!workflow) throw new Error(`Workflow "${workflowId}" không tồn tại.`);
  return workflow.steps || [];
}

async function runNextStep(runId, agentId) {
  const run = runStore.get(runId);
  if (!run) throw new Error(`Run "${runId}" không tồn tại.`);
  const steps = getSteps(run.workflowId);

  if (run.currentIndex >= steps.length) return { done: true, run };

  const step = steps[run.currentIndex];
  const args = resolveArgs(step.argsTemplate, run);

  let result;
  try {
    result = await executeAiTool(step.tool, args, { agentId });
  } catch (error) {
    result = { error: error.message };
  }

  run.stepResults.push({ stepId: step.id, tool: step.tool, result });
  run.currentIndex += 1;
  runStore.save(run);

  return { done: run.currentIndex >= steps.length, step, result, run };
}

module.exports = { runNextStep, getSteps };
