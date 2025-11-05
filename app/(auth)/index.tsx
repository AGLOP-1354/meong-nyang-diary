/**
 * 멍냥일기 로그인 화면
 * PRD & Design System 기반 리디자인
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, Platform } from 'react-native';

import { useTheme, SafeAreaWrapper, Container, Display, Body, Caption } from '@/design-system';
import { useAuthStore } from '@/stores/authStore';

import { Logo } from '@/components/common/Logo';
import KakaoIcon from '@/components/auth/KakaoIcon';
import GoogleIcon from '@/components/auth/GoogleIcon';
import AppleIcon from '@/components/auth/AppleIcon';

export default function LoginScreen() {
  const { theme } = useTheme();
  const signInWithOAuth = useAuthStore((s) => s.signInWithOAuth);

  const handleKakaoLogin = async () => {

    try {
      const { error } = await signInWithOAuth('kakao');

      if (error) {
        Alert.alert('카카오 로그인 실패', error.message || '알 수 없는 오류가 발생했습니다.');
      }
      // 성공 시 자동으로 세션이 설정되고 리다이렉트됨
    } catch (error) {
      Alert.alert('로그인 오류', '로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleGoogleLogin = async () => {

    try {
      const { error } = await signInWithOAuth('google');

      if (error) {
        Alert.alert('Google 로그인 실패', error.message || '알 수 없는 오류가 발생했습니다.');
      }
      // 성공 시 자동으로 세션이 설정되고 리다이렉트됨
    } catch (error) {
      Alert.alert('로그인 오류', '로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleAppleLogin = async () => {
    if (Platform.OS !== 'ios') {
      Alert.alert('Apple 로그인', 'Apple 로그인은 iOS에서만 사용 가능합니다.');
      return;
    }

    try {
      const { error } = await signInWithOAuth('apple');

      if (error) {
        Alert.alert('Apple 로그인 실패', error.message || '알 수 없는 오류가 발생했습니다.');
      }
      // 성공 시 자동으로 세션이 설정되고 리다이렉트됨
    } catch (error) {
      Alert.alert('로그인 오류', '로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    contentWrapper: {
      flex: 1,
      justifyContent: 'space-between',
    },
    headerSection: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: theme.spacing[10],
    },
    logoContainer: {
      width: 140,
      height: 140,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primary[50],
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing[8],
      ...theme.shadows.lg,
    },
    titleContainer: {
      alignItems: 'center',
      gap: theme.spacing[2],
    },
    appTitle: {
      marginBottom: theme.spacing[1],
    },
    subtitle: {
      textAlign: 'center',
      paddingHorizontal: theme.spacing[6],
      lineHeight: 26,
    },
    footerSection: {
      paddingBottom: theme.spacing[8],
      paddingHorizontal: theme.spacing[4],
    },
    buttonsContainer: {
      gap: theme.spacing[3],
      marginBottom: theme.spacing[6],
    },
    socialButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 56,
      paddingVertical: theme.spacing[4],
      paddingHorizontal: theme.spacing[6],
      borderRadius: theme.radius.lg,
      ...theme.shadows.md,
    },
    kakaoButton: {
      backgroundColor: '#FEE500',
    },
    googleButton: {
      backgroundColor: theme.colors.neutral.white,
      borderWidth: 1.5,
      borderColor: theme.colors.neutral[300],
    },
    appleButton: {
      backgroundColor: '#000000',
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
    },
    buttonIcon: {
      width: 24,
      height: 24,
    },
    buttonText: {
      fontSize: theme.typography.fontSize.bodyMd,
      fontWeight: theme.typography.fontWeight.semibold,
      fontFamily: theme.typography.fontFamily.primary,
    },
    kakaoButtonText: {
      color: '#371C1D',
    },
    googleButtonText: {
      color: theme.colors.neutral[800],
    },
    appleButtonText: {
      color: theme.colors.neutral.white,
    },
    termsContainer: {
      paddingHorizontal: theme.spacing[4],
    },
    termsText: {
      textAlign: 'center',
      lineHeight: 20,
    },
  });

  return (
    <SafeAreaWrapper style={styles.container}>
      <Container style={styles.contentWrapper}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Logo size={80} />
          </View>
          <View style={styles.titleContainer}>
            <Display size="lg" weight="bold" color={theme.colors.primary[500]} style={styles.appTitle}>
              멍냥일기
            </Display>
            <Body size="lg" color={theme.colors.neutral[600]} style={styles.subtitle}>
              우리 집 최애의 매일을 기록해요
            </Body>
          </View>
        </View>

        {/* Footer Section - Login Buttons */}
        <View style={styles.footerSection}>
          <View style={styles.buttonsContainer}>
            {/* Kakao Login Button */}
            <TouchableOpacity
              style={[styles.socialButton, styles.kakaoButton]}
              onPress={handleKakaoLogin}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <KakaoIcon style={styles.buttonIcon} />
                <Text style={[styles.buttonText, styles.kakaoButtonText]}>
                  카카오로 시작하기
                </Text>
              </View>
            </TouchableOpacity>

            {/* Google Login Button */}
            <TouchableOpacity
              style={[styles.socialButton, styles.googleButton]}
              onPress={handleGoogleLogin}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <GoogleIcon style={styles.buttonIcon} />
                <Text style={[styles.buttonText, styles.googleButtonText]}>
                  Google로 시작하기
                </Text>
              </View>
            </TouchableOpacity>

            {/* Apple Login Button (iOS only) */}
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={[styles.socialButton, styles.appleButton]}
                onPress={handleAppleLogin}
                activeOpacity={0.8}
              >
                <View style={styles.buttonContent}>
                  <AppleIcon style={styles.buttonIcon} />
                  <Text style={[styles.buttonText, styles.appleButtonText]}>
                    Apple로 시작하기
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* Terms and Conditions */}
          <View style={styles.termsContainer}>
            <Caption size="sm" color={theme.colors.neutral[500]} style={styles.termsText}>
              계속 진행하면 멍냥일기 서비스 약관에 동의하고{'\n'}
              개인정보처리방침을 읽었음을 인정하는 것으로 간주됩니다.
            </Caption>
          </View>
        </View>
      </Container>
    </SafeAreaWrapper>
  );
}
