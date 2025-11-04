export const storageBoxQueryKeys = {
  all: () => ['storage-box'] as const,
  list: (folderId?: number | null) => [...storageBoxQueryKeys.all(), 'list', String(folderId)] as const,
};
