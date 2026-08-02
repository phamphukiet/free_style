// Định nghĩa tên channel dùng chung giữa main và renderer,
// tránh gõ tay chuỗi string rải rác dễ sai chính tả.
module.exports = {
  WINDOW_MINIMIZE: "window:minimize",
  WINDOW_MAXIMIZE: "window:maximize",
  WINDOW_CLOSE: "window:close",
  DIALOG_OPEN_FOLDER: "dialog:open-folder",
  STATE_LOAD_LAST_FOLDER: "state:load-last-folder",
  FS_READ_DIRECTORY: "fs:read-directory",
  FS_CREATE_FILE: "fs:create-file",
  FS_CREATE_FOLDER: "fs:create-folder",
  FS_RENAME: "fs:rename",
  FS_DELETE: "fs:delete",
  FS_COPY: "fs:copy",
};
