import { StorageBoxResponseType } from '@/types/storage-box';
import { apiClient } from '@/libs/api/client';

interface GetStorageBoxListParams {
  folderId?: number | null;
}

export const getStorageBoxList = async (params: GetStorageBoxListParams) => {
  const { folderId } = params;

  return apiClient.get<StorageBoxResponseType>(`/storage-box/list`, {
    query: {
      folderId: folderId ?? null,
    },
  });
};
