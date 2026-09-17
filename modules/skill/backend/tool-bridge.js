// tool-bridge.js
// Cầu nối AI tool "skill": chỉ thao tác trên catalog đã có (list/assign).
// Không có action install — tìm thấy skill ngoài thì chỉ trả về đề xuất,
// việc tải về do người dùng tự quyết ở UI.

const skillsStore = require("./catalog/skills-store");
const { searchAll } = require("./catalog/search");

function getToolSpec() {
  return {
    name: "skill",
    description:
      "Xem skill đang có trong catalog và gán cho agent hiện tại (action=list, action=assign). " +
      "Nếu không có skill phù hợp trong catalog, dùng action=suggest để tìm tối đa 3 skill có thể tải thêm — " +
      "CHỈ đề xuất cho người dùng xem, KHÔNG tự cài đặt, không có action nào để cài đặt.",
    parameters: {
      type: "object",
      properties: {
        action: { type: "string", enum: ["list", "assign", "suggest"] },
        query: {
          type: "string",
          description: "Từ khoá tìm skill, dùng cho action=list hoặc suggest.",
        },
        id: {
          type: "string",
          description: "id skill trong catalog, bắt buộc cho action=assign.",
        },
      },
      required: ["action"],
    },
  };
}

function list(args) {
  const q = (args.query || "").toLowerCase().trim();
  const all = skillsStore.list();
  const matched = q ? all.filter((s) => s.name.toLowerCase().includes(q)) : all;
  return {
    skills: matched.map((s) => ({ id: s.id, name: s.name, pinned: s.pinned })),
  };
}

function assign(args, agentId) {
  if (!args.id) throw new Error("Thiếu id skill để gán.");
  if (!agentId) throw new Error("Không xác định được agent hiện tại.");
  const skill = skillsStore.get(args.id);
  if (!skill)
    throw new Error(`Skill "${args.id}" không tồn tại trong catalog.`);

  const agentIds = new Set(skill.agentIds || []);
  agentIds.add(agentId);
  const saved = skillsStore.assignAgents(args.id, [...agentIds]);
  return {
    message: `Đã gán skill "${saved.name}" cho agent hiện tại.`,
    skill: saved,
  };
}

async function suggest(args) {
  if (!args.query) throw new Error("Thiếu query để tìm skill.");
  const results = await searchAll(args.query, "rating", null);
  const localIds = new Set(skillsStore.list().map((s) => s.id));
  const candidates = results.filter((r) => !localIds.has(r.id)).slice(0, 3);

  return {
    message: candidates.length
      ? `Tìm thấy ${candidates.length} skill có thể tải thêm — chỉ là đề xuất, chưa cài đặt.`
      : "Không tìm thấy skill phù hợp để đề xuất.",
    suggestions: candidates.map((c) => ({
      id: c.id,
      name: c.name,
      platformId: c.platformId,
      sourceUrl: c.sourceUrl,
      rating: c.rating,
      downloads: c.downloads,
    })),
  };
}

async function run(action, args = {}, agentId) {
  switch (action) {
    case "list":
      return list(args);
    case "assign":
      return assign(args, agentId);
    case "suggest":
      return await suggest(args);
    default:
      throw new Error(`Action "${action}" không tồn tại.`);
  }
}

module.exports = {
  getToolSpec,
  execute: (args = {}, ctx = {}) => run(args.action, args, ctx.agentId),
};
