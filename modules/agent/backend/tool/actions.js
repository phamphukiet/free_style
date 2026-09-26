// actions.js
// CRUD agent qua AI tool + test kết nối thật. Xoá bắt buộc xác nhận 2 bước.

const store = require("../agent/store.js");
const {
  resolveProviderId,
  resolveKeyForProvider,
  resolveModel,
  listAvailable,
} = require("./provider-resolve.js");
const { getCapability } = require("../../../../shared/capability-registry");
const {
  loadCredentialsSync,
  decrypt,
} = require("../../../../src/main/ipc/credentials/storage");

function resolveAgent(idOrName) {
  if (!idOrName) return null;
  const all = store.list();
  const h = idOrName.toLowerCase();
  return (
    all.find((a) => a.id === idOrName) ||
    all.find((a) => a.name.toLowerCase() === h) ||
    all.find((a) => a.name.toLowerCase().includes(h))
  );
}

async function buildAgentFields({ providerHint, keyHint, modelHint }) {
  const providerId = resolveProviderId(providerHint);
  if (!providerId)
    throw new Error(
      `Không xác định được provider từ "${providerHint}". Khả dụng: ${listAvailable()
        .map((p) => p.providerId)
        .join(", ")}`,
    );
  const key = resolveKeyForProvider(providerId, keyHint);
  if (!key)
    throw new Error(`Provider "${providerId}" chưa có API key nào được lưu.`);
  const model = await resolveModel(providerId, key.value, modelHint);
  return { providerId, keyId: key.keyId, model };
}

async function create(args) {
  if (!args.name) throw new Error("Thiếu tên agent.");
  const fields = await buildAgentFields(args);
  const agent = store.save({ name: args.name, ...fields });
  return {
    message: `Đã tạo agent "${agent.name}" (${fields.providerId} · ${fields.model}).`,
    agent,
  };
}

async function update(args) {
  const existing = resolveAgent(args.id);
  if (!existing) throw new Error("Agent không tồn tại.");
  const patch = { id: existing.id, name: args.name || existing.name };
  if (args.providerHint || args.keyHint || args.modelHint) {
    Object.assign(
      patch,
      await buildAgentFields({
        providerHint: args.providerHint || existing.providerId,
        keyHint: args.keyHint,
        modelHint: args.modelHint || existing.model,
      }),
    );
  }
  const agent = store.save(patch);
  return { message: `Đã cập nhật agent "${agent.name}".`, agent };
}

function remove(args) {
  const existing = resolveAgent(args.id);
  if (!existing) throw new Error("Agent không tồn tại.");
  if (!args.confirmed) {
    return {
      needsConfirmation: true,
      message: `Xác nhận xoá agent "${existing.name}"? Nếu người dùng đồng ý, gọi lại với confirmed=true.`,
    };
  }
  const ok = store.remove(existing.id);
  return ok
    ? { message: `Đã xoá agent "${existing.name}".` }
    : { message: `Không thể xoá agent "${existing.name}" (agent mặc định).` };
}

async function test(args) {
  const agent = resolveAgent(args.id);
  if (!agent) throw new Error("Agent không tồn tại.");
  if (!agent.providerId || !agent.keyId)
    throw new Error(`Agent "${agent.name}" chưa gán provider/key.`);
  const entry = loadCredentialsSync()[agent.providerId]?.keys?.find(
    (k) => k.id === agent.keyId,
  );
  const apiKey = entry && decrypt(entry);
  if (!apiKey) throw new Error(`Không lấy được API key cho "${agent.name}".`);
  const provider = getCapability("provider", agent.providerId);
  if (!provider?.client?.chatCompletion)
     throw new Error(`Provider "${agent.providerId}" chưa hỗ trợ test.`);
  const reply = await provider.client.chatCompletion(
    apiKey,
    args.message || "Xin chào, đây là tin nhắn test.",
    agent.model,
    "",
  );
  const content = typeof reply === "object" ? reply.content : reply;
  return { message: `Test OK: ${content}` };
}

function list() {
  return { agents: store.list(), providersAvailable: listAvailable() };
}

module.exports = { create, update, remove, test, list };
