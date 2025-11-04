import { Text, StyleSheet, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { lightTheme } from '@/constants/theme';

import ExportIcon from './ExportIcon';
import ScreenHeaderLayout from '../common/ScreenHeaderLayout';

interface BoxHeaderProps {
  title: string;
}

const BoxHeader = (props: BoxHeaderProps) => {
  const { title } = props;

  const canGoBack = router.canGoBack();

  return (
    <ScreenHeaderLayout>
      <View style={styles.headerLeft}>
        {canGoBack && (
          <Pressable onPress={() => router.back()}>
            <Feather name="chevron-left" size={16} color={'black'} />
          </Pressable>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.exportIconContainer}>
        <ExportIcon />
      </View>
    </ScreenHeaderLayout>
  );
};

export default BoxHeader;

const styles = StyleSheet.create({
  exportIconContainer: {
    padding: 8,
  },
  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  title: {
    color: lightTheme.textColorDefault,
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 22.4,
  },
});
