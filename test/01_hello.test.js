require("./helpers/electron-bootstrap").ensureElectronMain(__filename);
const { runChatSendTest } = require("./helpers/chat-send-runner");

const TEST_CASE = {
  message: "hello", // nội dung gõ vào ô input chat
  agentId: "manager", // vd "manager" — null nếu không chọn agent
  providerId: "gemini", // đổi theo provider đã lưu API key thật (vd "gemini")
  keyId: null, // null => dùng key đầu tiên của provider
  model: null, // null => dùng model mặc định
  sessionId: null, // null => tự tạo session mới
};

runChatSendTest(TEST_CASE)
  .then((r) => require("electron").app.exit(r.ok ? 0 : 1))
  .catch((err) => {
    console.error("❌ Test lỗi ngoài dự kiến:", err);
    require("electron").app.exit(1);
  });
