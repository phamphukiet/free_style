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

const normalize = (p) => (p ? p.replace(/\\/g, "/").toLowerCase() : "");

export async function movePath(sourcePath, targetFolderPath, isDirectory) {
  const srcNorm = normalize(sourcePath);
  const targetNorm = normalize(targetFolderPath);
  const parentNorm = normalize(getParentPath(sourcePath));

  if (targetNorm === parentNorm) return null; // thả lại đúng chỗ cũ, bỏ qua
  if (targetNorm === srcNorm || targetNorm.startsWith(srcNorm + "/"))
    return null; // thả vào chính nó / con của nó

  const name = sourcePath.split(/[\\/]/).pop();
  const uniqueName = await resolveUniqueName(
    targetFolderPath,
    name,
    isDirectory,
  );
  return window.api.fs.rename(sourcePath, `${targetFolderPath}/${uniqueName}`);
}

export async function copyPath(sourcePath, targetFolderPath, isDirectory) {
  const name = sourcePath.split(/[\\/]/).pop();
  const uniqueName = await resolveUniqueName(
    targetFolderPath,
    name,
    isDirectory,
  );
  return window.api.fs.copy(sourcePath, `${targetFolderPath}/${uniqueName}`);
}