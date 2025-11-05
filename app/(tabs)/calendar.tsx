/**
 * 멍냥일기 폴더 뷰 (Calendar 탭)
 * PRD 4.1.2 폴더 뷰 기반 구현
 */

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaWrapper, useTheme, Heading, Body, Caption } from '@/design-system';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FOLDER_COLUMNS = 2;
const HORIZONTAL_PADDING = 16;
const FOLDER_SPACING = 12;
const FOLDER_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - FOLDER_SPACING) / FOLDER_COLUMNS;

// 더미 폴더 데이터
const DUMMY_FOLDERS = [
  { id: 'milestone-100', title: 'D+100', subtitle: '입양 100일', photoCount: 45, coverImage: 'https://picsum.photos/seed/d100/400' },
  { id: 'milestone-200', title: 'D+200', subtitle: '입양 200일', photoCount: 38, coverImage: 'https://picsum.photos/seed/d200/400' },
  { id: 'month-1', title: '1개월', subtitle: '2024년 1월', photoCount: 120, coverImage: 'https://picsum.photos/seed/month1/400' },
  { id: 'month-2', title: '2개월', subtitle: '2024년 2월', photoCount: 98, coverImage: 'https://picsum.photos/seed/month2/400' },
  { id: 'month-3', title: '3개월', subtitle: '2024년 3월', photoCount: 156, coverImage: 'https://picsum.photos/seed/month3/400' },
  { id: 'milestone-365', title: '1살', subtitle: '2024년 12월 25일', photoCount: 89, coverImage: 'https://picsum.photos/seed/1year/400' },
  { id: 'month-4', title: '4개월', subtitle: '2024년 4월', photoCount: 134, coverImage: 'https://picsum.photos/seed/month4/400' },
  { id: 'month-5', title: '5개월', subtitle: '2024년 5월', photoCount: 167, coverImage: 'https://picsum.photos/seed/month5/400' },
];

export default function CalendarScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const handleFolderPress = (folderId: string) => {
    // TODO: Navigate to folder detail screen
    console.log('Folder pressed:', folderId);
    // router.push(`/box/${folderId}`);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[4],
      backgroundColor: theme.colors.background.primary,
    },
    folderGrid: {
      paddingHorizontal: theme.spacing[2],
      paddingBottom: theme.spacing[4],
    },
    folderRow: {
      flexDirection: 'row',
      gap: FOLDER_SPACING,
      marginBottom: FOLDER_SPACING,
    },
    folderCard: {
      width: FOLDER_WIDTH,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.radius.lg,
      overflow: 'hidden',
      ...theme.shadows.md,
    },
    folderCover: {
      width: '100%',
      height: FOLDER_WIDTH * 0.85,
      backgroundColor: theme.colors.neutral[200],
    },
    folderInfo: {
      padding: theme.spacing[3],
    },
    folderTitle: {
      marginBottom: theme.spacing[1],
    },
    folderSubtitle: {
      marginBottom: theme.spacing[2],
    },
  });

  // 2열 그리드로 폴더 배열
  const folderRows: typeof DUMMY_FOLDERS[] = [];
  for (let i = 0; i < DUMMY_FOLDERS.length; i += FOLDER_COLUMNS) {
    folderRows.push(DUMMY_FOLDERS.slice(i, i + FOLDER_COLUMNS));
  }

  return (
    <SafeAreaWrapper style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Heading level={2} color={theme.colors.neutral[800]}>
          보리의 앨범
        </Heading>
      </View>

      {/* 폴더 그리드 */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.folderGrid}>
          {folderRows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.folderRow}>
              {row.map((folder) => (
                <TouchableOpacity
                  key={folder.id}
                  style={styles.folderCard}
                  activeOpacity={0.8}
                  onPress={() => handleFolderPress(folder.id)}
                >
                  <Image source={{ uri: folder.coverImage }} style={styles.folderCover} resizeMode="cover" />
                  <View style={styles.folderInfo}>
                    <Heading level={4} color={theme.colors.neutral[800]} style={styles.folderTitle}>
                      {folder.title}
                    </Heading>
                    <Caption size="sm" color={theme.colors.neutral[500]} style={styles.folderSubtitle}>
                      {folder.subtitle}
                    </Caption>
                    <Body size="sm" color={theme.colors.neutral[600]}>
                      사진 {folder.photoCount}장
                    </Body>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}
