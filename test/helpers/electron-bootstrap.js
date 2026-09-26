// electron-bootstrap.js
// Đảm bảo script đang chạy BÊN TRONG Electron main process.
// Nếu bị chạy bằng `node xxx.test.js` (vd nút "Run" mặc định của editor),
// require("electron") trả về CHUỖI đường dẫn tới binary Electron —
// khi đó ta tự spawn lại chính file này bằng đúng binary đó rồi thoát,
// để phần code phía dưới luôn chạy trong môi trường Electron thật.

function ensureElectronMain(entryFile) {
  const electronPath = require("electron");

  if (typeof electronPath === "string") {
    const { spawnSync } = require("child_process");
    console.log(
      "[bootstrap] Đang chạy bằng `node` — tự khởi động lại qua Electron binary...",
    );
    const result = spawnSync(electronPath, [entryFile], {
      stdio: "inherit",
      env: process.env,
    });
    process.exit(result.status === null ? 1 : result.status);
  }
  // Nếu không phải string (tức đã chạy trong Electron main) -> làm gì cũng không, cho code chạy tiếp.
}

module.exports = { ensureElectronMain };
