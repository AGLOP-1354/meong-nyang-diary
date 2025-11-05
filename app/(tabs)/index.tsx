/**
 * 멍냥일기 홈 화면 (캘린더 뷰)
 * PRD & Design System 기반 구현
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaWrapper, useTheme, Heading, Body, Caption } from '@/design-system';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CALENDAR_COLUMNS = 7; // 일주일
const HORIZONTAL_PADDING = 16;
const CELL_SPACING = 8;
const CELL_SIZE = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CELL_SPACING * (CALENDAR_COLUMNS - 1)) / CALENDAR_COLUMNS;
const PHOTO_SIZE = CELL_SIZE * 0.85; // 사진 크기는 셀보다 약간 작게

// 더미 데이터
const DUMMY_PET = {
  id: 1,
  name: '보리',
  type: 'dog', // or 'cat'
  adoptionDate: '2024-01-01',
  profileImage: 'https://picsum.photos/seed/profile-bori/100',
  daysWithUs: 309, // D+309
};

// 날짜별 사진 데이터 (날짜를 키로 사용) - 2025년 11월 기준
const DUMMY_PHOTOS_BY_DATE: Record<string, { imageUrl: string; dDay: number }> = {
  '2025-11-01': { imageUrl: 'https://picsum.photos/seed/dog1/400', dDay: 670 },
  '2025-11-02': { imageUrl: 'https://picsum.photos/seed/cat1/400', dDay: 671 },
  '2025-11-03': { imageUrl: 'https://picsum.photos/seed/pet1/400', dDay: 672 },
  '2025-11-04': { imageUrl: 'https://picsum.photos/seed/dog2/400', dDay: 673 },
};

// 아이콘 컴포넌트들
const ChevronLeftIcon = ({ color, size = 24 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M15 18L9 12L15 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronRightIcon = ({ color, size = 24 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PlusIcon = ({ color, size = 24 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5V19M5 12H19" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// 달력 유틸리티 함수들
const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

const formatDateKey = (year: number, month: number, day: number): string => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

export default function HomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 현재 날짜 기준으로 초기화
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-11
  const [selectedDate, setSelectedDate] = useState<number | null>(today.getDate()); // 선택된 날짜

  const onRefresh = () => {
    setRefreshing(true);
    // 실제로는 데이터를 다시 가져오는 로직
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // 사진 업로드 관련 함수들
  const handleUploadPress = () => {
    Alert.alert('사진 업로드', '어떻게 사진을 추가하시겠습니까?', [
      {
        text: '카메라로 촬영',
        onPress: handleTakePhoto,
      },
      {
        text: '갤러리에서 선택',
        onPress: handleSelectFromGallery,
      },
      {
        text: '취소',
        style: 'cancel',
      },
    ]);
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('권한 필요', '카메라 권한이 필요합니다.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setUploading(true);
        // TODO: Upload photo to server
        console.log('Photo taken:', result.assets[0].uri);
        setTimeout(() => {
          setUploading(false);
          Alert.alert('업로드 완료', '사진이 성공적으로 업로드되었습니다!');
        }, 1500);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('오류', '사진 촬영 중 오류가 발생했습니다.');
    }
  };

  const handleSelectFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        setUploading(true);
        // TODO: Upload photos to server
        console.log(`Selected ${result.assets.length} photos`);
        setTimeout(() => {
          setUploading(false);
          Alert.alert('업로드 완료', `${result.assets.length}장의 사진이 업로드되었습니다!`);
        }, 2000);
      }
    } catch (error) {
      console.error('Error selecting photos:', error);
      Alert.alert('오류', '사진 선택 중 오류가 발생했습니다.');
    }
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDatePress = (day: number) => {
    setSelectedDate(day);
    const dateKey = formatDateKey(currentYear, currentMonth, day);

    // 미래 날짜는 클릭 불가
    const selectedDateObj = new Date(currentYear, currentMonth, day);
    const todayDateObj = new Date();
    todayDateObj.setHours(0, 0, 0, 0);

    if (selectedDateObj > todayDateObj) {
      return;
    }

    // 사진이 있든 없든 해당 날짜 화면으로 이동
    router.push(`/photos/${dateKey}`);
  };

  // 달력 데이터 생성
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfWeek = getFirstDayOfMonth(currentYear, currentMonth);

  // 캘린더 그리드 생성 (6주 x 7일)
  const calendarDays: (number | null)[] = [];

  // 빈 셀 추가 (이전 달의 빈 공간)
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // 실제 날짜 추가
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background.primary,
      flex: 1,
    },
    // 간소화된 헤더
    header: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
    },
    headerContent: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: theme.spacing[3],
    },
    profileImage: {
      backgroundColor: theme.colors.neutral[200],
      borderRadius: theme.radius.full,
      height: 40,
      width: 40,
    },
    petName: {
      flex: 1,
    },
    dDayBadge: {
      backgroundColor: theme.colors.secondary[100],
      borderRadius: theme.radius.full,
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[1],
    },
    // 월 네비게이션
    monthNavigation: {
      alignItems: 'center',
      backgroundColor: theme.colors.background.primary,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[4],
    },
    monthText: {
      minWidth: 140,
      textAlign: 'center',
    },
    navButton: {
      padding: theme.spacing[2],
    },
    // 요일 헤더
    weekdayHeader: {
      backgroundColor: theme.colors.background.primary,
      flexDirection: 'row',
      paddingBottom: theme.spacing[2],
      paddingHorizontal: theme.spacing[2],
    },
    weekdayCell: {
      alignItems: 'center',
      marginHorizontal: CELL_SPACING / 2,
      width: CELL_SIZE,
    },
    // 캘린더 그리드
    calendarGrid: {
      paddingBottom: theme.spacing[4],
      paddingHorizontal: theme.spacing[2],
    },
    calendarRow: {
      flexDirection: 'row',
      marginBottom: CELL_SPACING,
    },
    dateCell: {
      alignItems: 'center',
      height: CELL_SIZE,
      justifyContent: 'center',
      marginHorizontal: CELL_SPACING / 2,
      width: CELL_SIZE,
    },
    dateCellEmpty: {
      backgroundColor: 'transparent',
    },
    dateCellSelected: {
      backgroundColor: theme.colors.primary[100],
      borderRadius: theme.radius.full,
      height: PHOTO_SIZE,
      width: PHOTO_SIZE,
    },
    dateCellWithPhoto: {
      borderRadius: theme.radius.full,
      height: PHOTO_SIZE,
      overflow: 'hidden',
      position: 'relative',
      width: PHOTO_SIZE,
    },
    dateCellToday: {
      borderColor: theme.colors.primary[400],
      borderRadius: theme.radius.full,
      borderWidth: 1,
      height: PHOTO_SIZE,
      width: PHOTO_SIZE,
    },
    photoThumbnail: {
      borderRadius: theme.radius.full,
      height: PHOTO_SIZE,
      width: PHOTO_SIZE,
    },
    photoDateOverlay: {
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderRadius: theme.radius.full,
      bottom: 0,
      justifyContent: 'center',
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    },
    dateCellContent: {
      alignItems: 'center',
      borderRadius: theme.radius.full,
      height: PHOTO_SIZE,
      justifyContent: 'center',
      width: PHOTO_SIZE,
    },
    dateCellDisabled: {
      opacity: 0.6,
    },
    // 플로팅 액션 버튼
    fab: {
      alignItems: 'center',
      backgroundColor: theme.colors.primary[500],
      borderRadius: 28,
      bottom: theme.spacing[3],
      height: 56,
      justifyContent: 'center',
      position: 'absolute',
      right: theme.spacing[4],
      width: 56,
      ...theme.shadows.lg,
      elevation: 8,
    },
    fabDisabled: {
      opacity: 0.6,
    },
  });

  // 요일 헤더
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  // 캘린더 행으로 분할 (7일씩)
  const calendarRows: (number | null)[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    calendarRows.push(calendarDays.slice(i, i + 7));
  }

  // 오늘 날짜 체크
  const isToday = (day: number | null): boolean => {
    if (!day) return false;
    const todayDate = new Date();
    return (
      day === todayDate.getDate() &&
      currentMonth === todayDate.getMonth() &&
      currentYear === todayDate.getFullYear()
    );
  };

  // 미래 날짜 체크
  const isFutureDate = (day: number | null): boolean => {
    if (!day) return false;
    const selectedDateObj = new Date(currentYear, currentMonth, day);
    const todayDateObj = new Date();
    todayDateObj.setHours(0, 0, 0, 0);
    return selectedDateObj > todayDateObj;
  };

  return (
    <SafeAreaWrapper style={styles.container}>
      {/* 간소화된 헤더 - 프로필 이미지, 펫 이름 & D-Day */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image
            source={{ uri: DUMMY_PET.profileImage }}
            style={styles.profileImage}
            resizeMode="cover"
          />
          <Heading level={3} color={theme.colors.neutral[800]} style={styles.petName}>
            {DUMMY_PET.name}
          </Heading>
          <View style={styles.dDayBadge}>
            <Caption size="sm" color={theme.colors.secondary[700]} weight="semibold">
              D+{DUMMY_PET.daysWithUs}
            </Caption>
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* 월 네비게이션 */}
        <View style={styles.monthNavigation}>
          <TouchableOpacity style={styles.navButton} onPress={goToPreviousMonth}>
            <ChevronLeftIcon color={theme.colors.neutral[700]} />
          </TouchableOpacity>
          <Heading level={3} color={theme.colors.neutral[800]} style={styles.monthText}>
            {currentYear}년 {currentMonth + 1}월
          </Heading>
          <TouchableOpacity style={styles.navButton} onPress={goToNextMonth}>
            <ChevronRightIcon color={theme.colors.neutral[700]} />
          </TouchableOpacity>
        </View>

        {/* 요일 헤더 */}
        <View style={styles.weekdayHeader}>
          {weekdays.map((day, index) => (
            <View key={index} style={styles.weekdayCell}>
              <Caption
                size="sm"
                color={index === 0 ? theme.colors.error[500] : theme.colors.neutral[600]}
                weight="semibold"
              >
                {day}
              </Caption>
            </View>
          ))}
        </View>

        {/* 캘린더 그리드 */}
        <View style={styles.calendarGrid}>
          {calendarRows.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.calendarRow}>
              {week.map((day, dayIndex) => {
                if (!day) {
                  // 빈 셀
                  return <View key={`empty-${weekIndex}-${dayIndex}`} style={[styles.dateCell, styles.dateCellEmpty]} />;
                }

                const dateKey = formatDateKey(currentYear, currentMonth, day);
                const photoData = DUMMY_PHOTOS_BY_DATE[dateKey];
                const hasPhoto = !!photoData;
                const isTodayDate = isToday(day);
                const isSelected = selectedDate === day;
                const isFuture = isFutureDate(day);

                return (
                  <TouchableOpacity
                    key={day}
                    style={styles.dateCell}
                    activeOpacity={isFuture ? 1 : 0.7}
                    onPress={() => handleDatePress(day)}
                    disabled={isFuture}
                  >
                    {hasPhoto ? (
                      // 사진이 있는 경우: 동그란 이미지 + 중앙 흰색 날짜
                      <View style={[styles.dateCellWithPhoto, isFuture && styles.dateCellDisabled]}>
                        <Image source={{ uri: photoData.imageUrl }} style={styles.photoThumbnail} resizeMode="cover" />
                        <View style={styles.photoDateOverlay}>
                          <Caption size="sm" color="#FFFFFF" weight="bold">
                            {day}
                          </Caption>
                        </View>
                      </View>
                    ) : (
                      // 사진이 없는 경우: 선택/오늘 표시
                      <View
                        style={[
                          styles.dateCellContent,
                          isSelected && !isFuture && styles.dateCellSelected,
                          isTodayDate && !isSelected && styles.dateCellToday,
                          isFuture && styles.dateCellDisabled,
                        ]}
                      >
                        <Caption
                          size="sm"
                          color={
                            isFuture
                              ? theme.colors.neutral[400]
                              : isSelected
                                ? theme.colors.primary[700]
                                : theme.colors.neutral[600]
                          }
                          weight={isSelected || isTodayDate ? 'bold' : 'regular'}
                        >
                          {day}
                        </Caption>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 플로팅 액션 버튼 */}
      <TouchableOpacity
        style={[styles.fab, uploading && styles.fabDisabled]}
        onPress={handleUploadPress}
        disabled={uploading}
        activeOpacity={0.8}
      >
        <PlusIcon color="#FFFFFF" size={28} />
      </TouchableOpacity>
    </SafeAreaWrapper>
  );
}
