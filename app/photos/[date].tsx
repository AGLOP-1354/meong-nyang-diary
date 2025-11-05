/**
 * 특정 날짜의 사진 목록 화면
 * PRD 5.3.4 사진 상세 화면 기반
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Platform, Alert } from 'react-native';
import { SafeAreaWrapper, useTheme, Heading, Body, Caption } from '@/design-system';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PHOTO_COLUMNS = 3;
const PHOTO_SPACING = 4;
const HORIZONTAL_PADDING = 16;
const PHOTO_SIZE = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - PHOTO_SPACING * (PHOTO_COLUMNS - 1)) / PHOTO_COLUMNS;

// 아이콘
const BackIcon = ({ color, size = 24 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19L5 12L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PlusIcon = ({ color, size = 24 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5V19M5 12H19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// 더미 사진 데이터
const DUMMY_PHOTOS = [
  { id: 1, imageUrl: 'https://picsum.photos/seed/photo1/600', time: '09:15' },
  { id: 2, imageUrl: 'https://picsum.photos/seed/photo2/600', time: '11:30' },
  { id: 3, imageUrl: 'https://picsum.photos/seed/photo3/600', time: '14:20' },
  { id: 4, imageUrl: 'https://picsum.photos/seed/photo4/600', time: '16:45' },
  { id: 5, imageUrl: 'https://picsum.photos/seed/photo5/600', time: '18:30' },
  { id: 6, imageUrl: 'https://picsum.photos/seed/photo6/600', time: '19:50' },
];

export default function PhotosByDateScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const dateString = params.date as string;
  const [uploading, setUploading] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handlePhotoPress = (photoId: number) => {
    // TODO: Navigate to photo detail screen
    console.log('Photo pressed:', photoId);
    // router.push(`/photos/detail/${photoId}?date=${dateString}`);
  };

  // 업로드 핸들러
  const handleTakePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('권한 필요', '카메라 권한이 필요합니다.');
        return;
      }

      setUploading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        // TODO: API 연동 - 선택된 날짜로 사진 업로드
        console.log('Camera photo for date:', dateString, result.assets[0].uri);
        Alert.alert('업로드 완료', '사진이 업로드되었습니다.');
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('오류', '사진을 촬영하는데 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleSelectFromGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
        return;
      }

      setUploading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        // TODO: API 연동 - 선택된 날짜로 사진들 업로드
        console.log('Gallery photos for date:', dateString, result.assets.map((a) => a.uri));
        Alert.alert('업로드 완료', `${result.assets.length}장의 사진이 업로드되었습니다.`);
      }
    } catch (error) {
      console.error('Gallery error:', error);
      Alert.alert('오류', '사진을 선택하는데 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadPress = () => {
    Alert.alert('사진 업로드', '어떻게 사진을 추가하시겠습니까?', [
      { text: '카메라로 촬영', onPress: handleTakePhoto },
      { text: '갤러리에서 선택', onPress: handleSelectFromGallery },
      { text: '취소', style: 'cancel' },
    ]);
  };

  // 날짜 포맷팅
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];

    return {
      full: `${year}년 ${month}월 ${day}일 ${weekday}요일`,
      short: `${month}월 ${day}일`,
    };
  };

  const formattedDate = formatDate(dateString);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
      backgroundColor: theme.colors.background.secondary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.neutral[200],
    },
    backButton: {
      padding: theme.spacing[2],
      marginRight: theme.spacing[2],
    },
    headerInfo: {
      flex: 1,
    },
    photoCount: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
    },
    photoGrid: {
      paddingHorizontal: theme.spacing[2],
      paddingBottom: theme.spacing[4],
    },
    photoRow: {
      flexDirection: 'row',
      gap: PHOTO_SPACING,
      marginBottom: PHOTO_SPACING,
    },
    photoCard: {
      width: PHOTO_SIZE,
      height: PHOTO_SIZE,
      borderRadius: theme.radius.sm,
      overflow: 'hidden',
      backgroundColor: theme.colors.neutral[200],
    },
    photoImage: {
      width: '100%',
      height: '100%',
    },
    timeOverlay: {
      position: 'absolute',
      bottom: 4,
      right: 4,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      paddingHorizontal: theme.spacing[2],
      paddingVertical: theme.spacing[1],
      borderRadius: theme.radius.xs,
    },
    fab: {
      position: 'absolute',
      right: theme.spacing[4],
      bottom: theme.spacing[3],
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.primary[500],
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.shadows.lg,
      elevation: 8,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[8],
      paddingVertical: theme.spacing[12],
    },
  });

  // 3열 그리드로 사진 배열
  const photoRows: typeof DUMMY_PHOTOS[] = [];
  for (let i = 0; i < DUMMY_PHOTOS.length; i += PHOTO_COLUMNS) {
    photoRows.push(DUMMY_PHOTOS.slice(i, i + PHOTO_COLUMNS));
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaWrapper style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
            <BackIcon color={theme.colors.neutral[700]} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Heading level={3} color={theme.colors.neutral[800]}>
              {formattedDate.full}
            </Heading>
          </View>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {/* 사진 개수 */}
          {DUMMY_PHOTOS.length > 0 ? (
            <>
              <View style={styles.photoCount}>
                <Body size="md" color={theme.colors.neutral[600]}>
                  총 {DUMMY_PHOTOS.length}장의 사진
                </Body>
              </View>

              {/* 사진 그리드 */}
              <View style={styles.photoGrid}>
                {photoRows.map((row, rowIndex) => (
                  <View key={rowIndex} style={styles.photoRow}>
                    {row.map((photo) => (
                      <TouchableOpacity
                        key={photo.id}
                        style={styles.photoCard}
                        activeOpacity={0.8}
                        onPress={() => handlePhotoPress(photo.id)}
                      >
                        <Image source={{ uri: photo.imageUrl }} style={styles.photoImage} resizeMode="cover" />
                        <View style={styles.timeOverlay}>
                          <Caption size="xs" color="#FFFFFF" weight="medium">
                            {photo.time}
                          </Caption>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </View>
            </>
          ) : (
            /* 빈 상태 */
            <View style={styles.emptyState}>
              <Heading level={3} color={theme.colors.neutral[400]} style={{ marginBottom: theme.spacing[2] }}>
                아직 사진이 없어요
              </Heading>
              <Body size="md" color={theme.colors.neutral[500]} style={{ textAlign: 'center' }}>
                오른쪽 아래 + 버튼을 눌러{'\n'}사진을 추가해보세요
              </Body>
            </View>
          )}
        </ScrollView>

        {/* 플로팅 액션 버튼 */}
        <TouchableOpacity
          style={styles.fab}
          onPress={handleUploadPress}
          activeOpacity={0.8}
          disabled={uploading}
        >
          <PlusIcon color="#FFFFFF" size={24} />
        </TouchableOpacity>
      </SafeAreaWrapper>
    </>
  );
}
