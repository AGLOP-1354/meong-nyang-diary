import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getStorageBoxList } from '@/libs/api/storage-box';
import { storageBoxQueryKeys } from '@/hooks/api/queryKeys';
import { StorageBoxResponseType } from '@/types/storage-box';

interface UseGetStorageBoxListQueryParams {
  folderId?: number | null;
  queryOptions?: Omit<
    UseQueryOptions<StorageBoxResponseType, Error, StorageBoxResponseType, ReturnType<typeof storageBoxQueryKeys.list>>,
    'queryKey' | 'queryFn'
  >;
}

export const useGetStorageBoxListQuery = (params: UseGetStorageBoxListQueryParams) => {
  return useQuery({
    queryFn: () => getStorageBoxList(params),
    queryKey: storageBoxQueryKeys.list(params.folderId),
  });
};
