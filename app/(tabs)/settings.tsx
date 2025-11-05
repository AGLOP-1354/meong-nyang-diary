/**
 * 멍냥일기 설정 화면
 */

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Switch } from 'react-native';
import { SafeAreaWrapper, useTheme, Heading, Body, Caption } from '@/design-system';
import Svg, { Path } from 'react-native-svg';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'expo-router';

// 아이콘
const ChevronRightIcon = ({ color, size = 20 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// 더미 펫 데이터
const DUMMY_PET = {
  name: '보리',
  profileImage: 'https://picsum.photos/seed/profile-bori/100',
  breed: '웰시코기',
  daysWithUs: 674,
};

export default function SettingsScreen() {
  const { theme } = useTheme();
  const signOut = useAuthStore((s) => s.signOut);
  const router = useRouter();
  const [pushEnabled, setPushEnabled] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)');
        },
      },
    ]);
  };

  const handleMenuPress = (menu: string) => {
    Alert.alert(menu, '준비 중인 기능입니다.');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[4],
      paddingBottom: theme.spacing[3],
    },
    profileSection: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background.secondary,
      marginHorizontal: theme.spacing[4],
      padding: theme.spacing[4],
      borderRadius: theme.radius.lg,
      marginBottom: theme.spacing[6],
      ...theme.shadows.sm,
    },
    profileImage: {
      width: 64,
      height: 64,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.neutral[200],
      marginRight: theme.spacing[3],
    },
    profileInfo: {
      flex: 1,
    },
    menuSection: {
      marginHorizontal: theme.spacing[4],
      marginBottom: theme.spacing[4],
    },
    sectionTitle: {
      marginBottom: theme.spacing[2],
      paddingHorizontal: theme.spacing[2],
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.background.secondary,
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[4],
      borderRadius: theme.radius.md,
      marginBottom: theme.spacing[2],
    },
    menuItemLeft: {
      flex: 1,
    },
    menuItemRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
    },
    logoutButton: {
      marginHorizontal: theme.spacing[4],
      marginTop: theme.spacing[4],
      backgroundColor: theme.colors.background.secondary,
      paddingVertical: theme.spacing[4],
      borderRadius: theme.radius.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.error[300],
    },
    version: {
      textAlign: 'center',
      marginTop: theme.spacing[8],
      marginBottom: theme.spacing[4],
    },
  });

  return (
    <SafeAreaWrapper style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Heading level={2} color={theme.colors.neutral[800]}>
          설정
        </Heading>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* 프로필 섹션 */}
        <View style={styles.profileSection}>
          <Image source={{ uri: DUMMY_PET.profileImage }} style={styles.profileImage} resizeMode="cover" />
          <View style={styles.profileInfo}>
            <Heading level={3} color={theme.colors.neutral[800]} style={{ marginBottom: theme.spacing[1] }}>
              {DUMMY_PET.name}
            </Heading>
            <Caption size="sm" color={theme.colors.neutral[600]}>
              {DUMMY_PET.breed}
            </Caption>
            <Caption size="sm" color={theme.colors.secondary[600]} style={{ marginTop: theme.spacing[1] }}>
              함께한 지 {DUMMY_PET.daysWithUs}일
            </Caption>
          </View>
          <ChevronRightIcon color={theme.colors.neutral[400]} />
        </View>

        {/* 펫 관리 */}
        <View style={styles.menuSection}>
          <Caption size="sm" color={theme.colors.neutral[500]} weight="semibold" style={styles.sectionTitle}>
            펫 관리
          </Caption>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => handleMenuPress('펫 프로필 수정')}
          >
            <View style={styles.menuItemLeft}>
              <Body size="md" color={theme.colors.neutral[800]}>
                펫 프로필 수정
              </Body>
            </View>
            <ChevronRightIcon color={theme.colors.neutral[400]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => handleMenuPress('펫 추가하기')}
          >
            <View style={styles.menuItemLeft}>
              <Body size="md" color={theme.colors.neutral[800]}>
                펫 추가하기
              </Body>
            </View>
            <ChevronRightIcon color={theme.colors.neutral[400]} />
          </TouchableOpacity>
        </View>

        {/* 가족 관리 */}
        <View style={styles.menuSection}>
          <Caption size="sm" color={theme.colors.neutral[500]} weight="semibold" style={styles.sectionTitle}>
            가족 관리
          </Caption>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => handleMenuPress('가족 구성원 보기')}
          >
            <View style={styles.menuItemLeft}>
              <Body size="md" color={theme.colors.neutral[800]}>
                가족 구성원 보기
              </Body>
            </View>
            <View style={styles.menuItemRight}>
              <Caption size="sm" color={theme.colors.neutral[500]}>
                4명
              </Caption>
              <ChevronRightIcon color={theme.colors.neutral[400]} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => handleMenuPress('가족 초대하기')}
          >
            <View style={styles.menuItemLeft}>
              <Body size="md" color={theme.colors.neutral[800]}>
                가족 초대하기
              </Body>
            </View>
            <ChevronRightIcon color={theme.colors.neutral[400]} />
          </TouchableOpacity>
        </View>

        {/* 앱 설정 */}
        <View style={styles.menuSection}>
          <Caption size="sm" color={theme.colors.neutral[500]} weight="semibold" style={styles.sectionTitle}>
            앱 설정
          </Caption>
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Body size="md" color={theme.colors.neutral[800]}>
                푸시 알림
              </Body>
            </View>
            <Switch value={pushEnabled} onValueChange={setPushEnabled} />
          </View>
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Body size="md" color={theme.colors.neutral[800]}>
                다크 모드
              </Body>
            </View>
            <Switch value={darkMode} onValueChange={setDarkMode} />
          </View>
        </View>

        {/* 계정 */}
        <View style={styles.menuSection}>
          <Caption size="sm" color={theme.colors.neutral[500]} weight="semibold" style={styles.sectionTitle}>
            계정
          </Caption>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => handleMenuPress('개인정보 처리방침')}
          >
            <View style={styles.menuItemLeft}>
              <Body size="md" color={theme.colors.neutral[800]}>
                개인정보 처리방침
              </Body>
            </View>
            <ChevronRightIcon color={theme.colors.neutral[400]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => handleMenuPress('이용약관')}>
            <View style={styles.menuItemLeft}>
              <Body size="md" color={theme.colors.neutral[800]}>
                이용약관
              </Body>
            </View>
            <ChevronRightIcon color={theme.colors.neutral[400]} />
          </TouchableOpacity>
        </View>

        {/* 로그아웃 */}
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7} onPress={handleLogout}>
          <Body size="md" color={theme.colors.error[600]} weight="semibold">
            로그아웃
          </Body>
        </TouchableOpacity>

        {/* 버전 정보 */}
        <Caption size="sm" color={theme.colors.neutral[400]} style={styles.version}>
          멍냥일기 v1.0.0
        </Caption>
      </ScrollView>
    </SafeAreaWrapper>
  );
}
