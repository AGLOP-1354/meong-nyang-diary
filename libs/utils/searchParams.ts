export const parseFolderIdSearchParam = (folderId: string | string[]) => {
  if (isNaN(Number(folderId))) return null;
  return Number(folderId);
};
