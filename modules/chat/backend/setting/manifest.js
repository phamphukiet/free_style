// manifest.js
// Công tắc tắt khẩn cấp cho AI điều khiển app, hiện trong màn hình Settings.
module.exports = {
  owner: "chat",
  settings: [
    {
      id: "chat.appControlEnabled",
      group: "Chat",
      label: "Cho phép AI điều khiển app",
      description:
        "Tắt để AI không thấy và không chạy được mọi lệnh của tool app.",
      type: "boolean",
      default: true,
      scope: "global", // project (.vibe) không tự bật lại được
      aiAccess: "none", // AI không đọc/đổi được công tắc của chính nó
      order: 10,
    },
  ],
};
