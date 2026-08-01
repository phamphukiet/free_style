// fs-actions.js
// Thao tác file/folder qua preload bridge — dùng chung giữa
// sidebar và tree-item, tránh viết trùng logic gọi window.api.fs.

export function getParentPath(targetPath) {
  return targetPath.split(/[\\/]/).slice(0, -1).join("/");
}

export function getUniqueName(existingNames, targetName, isDirectory) {
  if (!existingNames.includes(targetName)) return targetName;
  
  let baseName = targetName;
  let ext = "";
  
  if (!isDirectory) {
    const lastDotIndex = targetName.lastIndexOf(".");
    if (lastDotIndex > 0) {
      baseName = targetName.substring(0, lastDotIndex);
      ext = targetName.substring(lastDotIndex);
    }
  }
  
  let counter = 1;
  while (true) {
    const newName = `${baseName}(${counter})${ext}`;
    if (!existingNames.includes(newName)) return newName;
    counter++;
  }
}

export async function resolveUniqueName(parentPath, targetName, isDirectory) {
  const entries = await window.api.fs.readDirectory(parentPath);
  const existingNames = entries.map((e) => e.name);
  return getUniqueName(existingNames, targetName, isDirectory);
}

export async function createFile(folderPath, name) {
  const uniqueName = await resolveUniqueName(folderPath, name, false);
  return window.api.fs.createFile(`${folderPath}/${uniqueName}`);
}

export async function createFolder(folderPath, name) {
  const uniqueName = await resolveUniqueName(folderPath, name, true);
  return window.api.fs.createFolder(`${folderPath}/${uniqueName}`);
}

export async function renamePath(oldPath, newName, isDirectory) {
  const parentPath = getParentPath(oldPath);
  const uniqueName = await resolveUniqueName(parentPath, newName, isDirectory);
  return window.api.fs.rename(oldPath, `${parentPath}/${uniqueName}`);
}

export async function deletePath(targetPath) {
  return window.api.fs.delete(targetPath);
}
