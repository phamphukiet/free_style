// apply-loader.js
// Tự động nạp mọi file *-apply.js trong source/root/** (Vite eager glob).
// Thêm setting mới có xxx-apply.js → tự được nạp, KHÔNG cần sửa file này nữa.
import.meta.glob("../source/root/**/*-apply.js", { eager: true });