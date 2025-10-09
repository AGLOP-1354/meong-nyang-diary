import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useColorScheme } from 'react-native'

import { useAuthStore } from '@/stores/authStore'
import { UserType } from '@/types/user'
import { getThemeByScheme } from '@/constants/theme'
import { kakaoAuth } from '@/services/kakaoAuth'
import { googleAuth } from '@/services/googleAuth'

import { createStyles } from './styles'

import KakaoIcon from '../../../assets/logo/kakao-logo.svg'
import GoogleIcon from '../../../assets/logo/google-logo.svg'
import AppleIcon from '../../../assets/logo/apple-logo.svg'

const AuthScreen: React.FC = () => {
  const login = useAuthStore(s => s.login)
  const scheme = useColorScheme()
  const theme = getThemeByScheme(scheme)
  const styles = createStyles(theme)
  const [isLoading, setIsLoading] = useState(false)

  const handleKakaoLogin = async () => {
    if (!login) {
      Alert.alert('오류', '로그인 핸들러가 초기화되지 않았습니다.')
      return
    }

    if (isLoading) return

    setIsLoading(true)
    try {
      const res = await kakaoAuth.login()

      if (res.success && res.user) {
        const u: UserType = {
          id: res.user.id,
          uuid: `kakao-${res.user.id}`,
          name: res.user.nickname || '카카오 사용자',
          email: res.user.email || '',
          profileImage: res.user.profileImageUrl || '',
          createdAt: new Date(),
          updatedAt: new Date(),
          lastLoginAt: new Date(),
          version: 1,
          kakaoId: String(res.user.id),
        }
        login(u)
      } else {
        Alert.alert(
          '카카오 로그인 실패',
          'success' in res && !res.success ? res.error : '알 수 없는 오류가 발생했습니다.',
        )
      }
    } catch (error) {
      Alert.alert('로그인 오류', '로그인 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    if (!login) {
      Alert.alert('오류', '로그인 핸들러가 초기화되지 않았습니다.')
      return
    }

    if (isLoading) return

    setIsLoading(true)
    try {
      const res = await googleAuth.login()

      if (res.success && res.user) {
        const u: UserType = {
          id: parseInt(res.user.id, 10) || Date.now(),
          uuid: `google-${res.user.id}`,
          name: res.user.name || 'Google 사용자',
          email: res.user.email || '',
          profileImage: res.user.profileImageUrl || '',
          createdAt: new Date(),
          updatedAt: new Date(),
          lastLoginAt: new Date(),
          version: 1,
          googleId: res.user.id,
        }
        login(u)
      } else {
        Alert.alert('Google 로그인 실패', !res.success ? res.error : '알 수 없는 오류가 발생했습니다.')
      }
    } catch (error) {
      Alert.alert('로그인 오류', '로그인 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>로그인</Text>
        <TouchableOpacity
          accessibilityLabel="닫기"
          style={styles.closeButton}
          onPress={() => Alert.alert('닫기', '닫기 버튼 클릭됨')}
        >
          <Text style={{ color: theme.iconColorDefault }}>×</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.main}>
          <View style={styles.titleContainer}>
            <Image source={require('../../../assets/logo.png')} style={styles.logoImage} />
            <Text style={styles.title}>LINK DROPPER</Text>
            <Text style={styles.subtitle}>대문자 J의 링크 관리 습관</Text>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.socialButton, styles.kakaoButton, isLoading && styles.socialButtonDisabled]}
              onPress={handleKakaoLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#000" style={styles.iconLeft} />
              ) : (
                <KakaoIcon width={20} height={20} style={styles.iconLeft} />
              )}
              <Text style={styles.socialButtonText}>{isLoading ? '로그인 중...' : '카카오로 계속하기'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialButton, styles.googleButton, isLoading && styles.socialButtonDisabled]}
              onPress={handleGoogleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#000" style={styles.iconLeft} />
              ) : (
                <GoogleIcon width={20} height={20} style={styles.iconLeft} />
              )}
              <Text style={styles.socialButtonText}>{isLoading ? '로그인 중...' : 'Google로 계속하기'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialButton, styles.appleButton]}
              onPress={() => Alert.alert('Apple', '준비 중입니다.')}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#000" style={styles.iconLeft} />
              ) : (
                <AppleIcon width={20} height={20} style={styles.iconLeft} />
              )}
              <Text style={styles.socialButtonText}>{isLoading ? '로그인 중...' : 'Apple로 계속하기'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.terms}>
            계속 진행하면 LINK DROPPER 서비스 약관에 동의하고 개인정보처리방침을 읽었음을 인정하는 것으로 간주됩니다.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default AuthScreen
