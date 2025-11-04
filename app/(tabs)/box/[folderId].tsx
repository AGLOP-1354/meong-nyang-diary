import { StyleSheet, SafeAreaView } from 'react-native';

import { useLocalSearchParams } from 'expo-router';
import { useGetStorageBoxListQuery } from '@/hooks/api/storage-box/query';
import { parseFolderIdSearchParam } from '@/libs/utils/searchParams';
import { lightTheme } from '@/constants/theme';
import BoxItemList from '@/components/box/BoxItemList';
import BoxHeader from '@/components/box/BoxHeader';
import BoxChildItemList from '@/components/box/BoxChildItemList';

const HomeScreen = () => {
  const { folderId } = useLocalSearchParams();

  const { data: queryData } = useGetStorageBoxListQuery({
    folderId: parseFolderIdSearchParam(folderId),
  });

  const itemList = queryData?.data?.data || [];

  return (
    <SafeAreaView style={styles.container}>
      <BoxHeader title="보관함" />
      <BoxChildItemList itemList={itemList.filter((item) => item.type === 'folder')} />
      <BoxItemList itemList={itemList.filter((item) => item.type === 'link')} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: lightTheme.surfaceDefault,
    flex: 1,
  },
});

export default HomeScreen;
