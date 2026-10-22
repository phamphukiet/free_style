// index.js
// Nạp mọi handler effect workbench-level (glob). Thêm target = thêm 1 file cạnh đây.
import.meta.glob(["./*.js", "!./index.js"], { eager: true });
