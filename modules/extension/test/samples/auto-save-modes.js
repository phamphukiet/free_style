// Tự động lưu: chọn chế độ lưu trong dropdown.

module.exports = {
  name: "Tự động lưu",

  settings: {
    mode: {
      label: "Chế độ lưu",
      default: "interval",
      options: [
        { value: "interval", label: "Mỗi 5 giây" },
        { value: "on-close", label: "Khi tắt app" },
        { value: "on-switch", label: "Khi chuyển màn hình" },
        { value: "off", label: "Không tự lưu" },
      ],
    },
  },

  run({ settings, commands }) {
    if (settings.mode === "interval") {
      setInterval(() => commands.editor.saveAll(), 5000);
    } else if (settings.mode !== "off") {
      console.log("chế độ", settings.mode, "chưa có sự kiện để chạy");
    }
  },
};
