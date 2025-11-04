import { View, Text, StyleSheet, Pressable } from 'react-native';

import { lightTheme } from '@/constants/theme';
import { FolderType } from '@/types/storage-box';

import FolderIcon from './FolderIcon';

interface BoxChildItemProps {
  item: FolderType;
  onPress?: () => void;
}

const BoxChildItem = (props: BoxChildItemProps) => {
  const { item, onPress = () => {} } = props;

  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <FolderIcon />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <View>
          <Text style={styles.count}>{item.unreadLinksCount || 0}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default BoxChildItem;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderColor: lightTheme.borderDefault,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    minHeight: 36,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  count: {
    color: lightTheme.textColorTertiary,
    fontSize: 14,
    fontWeight: 400,
  },
  iconContainer: {
    paddingTop: 0,
  },
  textContainer: {
    height: '100%',
  },
  title: {
    color: lightTheme.textColorDefault,
    fontSize: 14,
    fontWeight: 500,
  },
});
