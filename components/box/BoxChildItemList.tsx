import { FlatList, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { FolderType } from '@/types/storage-box';

import BoxChildItem from './BoxChildItem';

interface BoxChildItemListProps {
  itemList: FolderType[];
}

const BoxChildItemList = (props: BoxChildItemListProps) => {
  const { itemList } = props;

  const handlePressChildItem = (item: FolderType) => {
    router.push(`/box/${item.id}`);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={itemList}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => <BoxChildItem item={item} onPress={() => handlePressChildItem(item)} />}
        keyExtractor={(item) => String(item.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false} // iOS
        overScrollMode="never" // Android
      />
    </View>
  );
};

export default BoxChildItemList;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  listContainer: {
    gap: 8,
    paddingHorizontal: 16,
  },
});
