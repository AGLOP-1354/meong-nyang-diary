export interface LinkType {
  id: number | string;
  title: string;
  description?: string | null;
  imageUrl: string;
  url: string;
  type: 'link';
  sortOrder: number;
  folderId?: number | null;
  createdAt?: Date | null;
  lastUseDate?: Date | null;
  isTrashed?: boolean;
}

export type FolderType = {
  id: number | string;
  title: string;
  parentId: number | null;
  lastUseDate: Date | null;
  sortOrder: number;
  createdAt: Date | null;
  type: 'folder';
  unreadLinksCount?: number;
  isTrashed?: boolean;
};

export type StorageBoxItemType = LinkType | FolderType;

export type StorageBoxResponseType = {
  data: StorageBoxItemType[];
  count: number;
};
