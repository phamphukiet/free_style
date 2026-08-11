// apply-loader.js
// Tự động nạp mọi file "*-apply.js" nằm trong backend/sources/<origin>/<module>/.
// Đây là NƠI DUY NHẤT biết đường dẫn tới sources — mọi setting mới (prime/custom/
// downloaded) chỉ cần đặt file đúng quy ước tên, không cần sửa dòng nào ở đây.
//
// Các file *-apply.js tuy nằm trong backend/ nhưng là code renderer thuần
// (dùng window.api, document) — được đặt cạnh phần commands/actions của
// chính setting đó để dễ bảo trì cùng nhau, không phải chạy trong main process.

const modules = import.meta.glob("../backend/sources/*/*/*-apply.js", {
  eager: true,
});

// eager: true đã tự chạy code trong mỗi file lúc import ở trên.
// Export ra để dễ debug xem đã nạp được đúng những file nào.
export const loadedApplies = Object.keys(modules);
