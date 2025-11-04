import React from 'react';
import { Image, Pressable, StyleSheet, Text, View, SafeAreaView } from 'react-native';

import { LinkType } from '@/types/storage-box';
import { lightTheme } from '@/constants/theme';

interface BoxLinkItemProps {
  item: LinkType;
}

const BoxLinkItem = (props: BoxLinkItemProps) => {
  const { item } = props;

  const { title, description, imageUrl } = item;
  const imageSource = imageUrl ? { uri: imageUrl } : require('@/assets/storage-box/link-item-placeholder.png');

  return (
    <SafeAreaView>
      <Pressable style={styles.container}>
        <View style={styles.leftSection}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
          <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
            {description}
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <Image source={imageSource} style={styles.image} />
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

export default BoxLinkItem;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: lightTheme.surfaceDefault,
    flexDirection: 'row',
    gap: 20,
  },
  description: {
    color: lightTheme.textColorSecondary,
    fontSize: 14,
    fontWeight: 400,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  imageContainer: {
    borderRadius: 20,
    height: 80,
    overflow: 'hidden',
    width: 80,
  },
  leftSection: {
    flex: 1,
    gap: 8,
  },
  title: {
    color: lightTheme.textColorDefault,
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 22.4,
  },
});
