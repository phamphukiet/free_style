// fs-actions.js
// Thao tác file/folder qua preload bridge — dùng chung giữa
// sidebar và tree-item, tránh viết trùng logic gọi window.api.fs.

export function getParentPath(targetPath) {
  return targetPath.split(/[\\/]/).slice(0, -1).join("/");
}

export async function createFile(folderPath, name) {
  return window.api.fs.createFile(`${folderPath}/${name}`);
}

export async function createFolder(folderPath, name) {
  return window.api.fs.createFolder(`${folderPath}/${name}`);
}

export async function renamePath(oldPath, newName) {
  const parentPath = getParentPath(oldPath);
  return window.api.fs.rename(oldPath, `${parentPath}/${newName}`);
}

export async function deletePath(targetPath) {
  return window.api.fs.delete(targetPath);
}
