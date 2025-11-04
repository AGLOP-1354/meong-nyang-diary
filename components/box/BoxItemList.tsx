import { FlatList, StyleSheet } from 'react-native';

import { LinkType } from '@/types/storage-box';
import BoxLinkItem from './BoxLinkItem';

interface BoxItemListProps {
  itemList: LinkType[];
}

const BoxItemList = (props: BoxItemListProps) => {
  const { itemList } = props;

  return (
    <FlatList
      data={itemList}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => <BoxLinkItem item={item} />}
      keyExtractor={(item) => String(item.id)}
    />
  );
};

export default BoxItemList;

const styles = StyleSheet.create({
  listContainer: {
    flexDirection: 'column',
    gap: 24,
    padding: 16,
  },
});
