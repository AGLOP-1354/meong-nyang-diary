import { initializeKakaoSDK } from '@react-native-kakao/core'
import { login as kakaoLogin, me as getKakaoProfile, logout as kakaoLogout } from '@react-native-kakao/user'
import Constants from 'expo-constants'

export type KakaoAuthUser = {
  id: number
  nickname?: string
  email?: string
  profileImageUrl?: string
}

export type KakaoLoginResult = { success: true; user: KakaoAuthUser } | { success: false; error: string }

export const kakaoAuth = {
  initialize(): void {
    const config = kakaoAuth.getConfig()
    if (config.nativeAppKey) {
      try {
        initializeKakaoSDK(config.nativeAppKey)
      } catch (error) {
        console.error('카카오 SDK 초기화 실패:', error)
      }
    } else {
      console.warn('카카오 네이티브 앱 키가 설정되지 않았습니다.')
    }
  },

  async login(): Promise<KakaoLoginResult> {
    try {
      if (typeof kakaoLogin !== 'function') {
        return {
          success: false,
          error: '카카오 로그인 함수를 찾을 수 없습니다. SDK가 제대로 설치되지 않았을 수 있습니다.',
        }
      }

      const result = await kakaoLogin()

      if (!result) {
        return { success: false, error: '로그인 결과를 받을 수 없습니다.' }
      }

      if (typeof getKakaoProfile !== 'function') {
        return { success: false, error: '카카오 프로필 함수를 찾을 수 없습니다.' }
      }

      const profile = await getKakaoProfile()

      if (!profile || !profile.id) {
        return { success: false, error: '프로필 정보를 가져올 수 없습니다.' }
      }

      return {
        success: true,
        user: {
          id: profile.id,
          nickname: profile.nickname,
          email: profile.email,
          profileImageUrl: profile.profileImageUrl,
        },
      }
    } catch (e: unknown) {
      let message = '카카오 로그인에 실패했습니다.'

      if (e && typeof e === 'object') {
        const err = e as { code?: number | string; message?: string }

        if (err?.message) {
          if (err.message.includes('bundleId validation failed')) {
            message = 'iOS bundleId 검증 실패: 카카오 개발자 콘솔에 번들 ID를 정확히 등록해주세요.'
          } else if (err.message.includes('SdkError error 2') || err.message.includes('SdkError error 0')) {
            message = 'SDK 초기화/설정 문제입니다. 앱을 재빌드하거나 키 설정을 확인해주세요.'
          } else if (err.message.toLowerCase().includes('cancel')) {
            message = '사용자가 로그인을 취소했습니다.'
          } else {
            message = err.message
          }
        }
      }

      return { success: false, error: message }
    }
  },

  async logout(): Promise<boolean> {
    try {
      await kakaoLogout()
      return true
    } catch {
      return false
    }
  },

  async loginWithWeb(): Promise<KakaoLoginResult> {
    try {
      const config = this.getConfig()
      if (!config.restApiKey) {
        return { success: false, error: 'REST API 키가 설정되지 않았습니다.' }
      }

      return { success: false, error: '웹 로그인은 WebBrowser 모듈이 필요합니다.' }
    } catch (error) {
      return { success: false, error: '웹 로그인 중 오류가 발생했습니다.' }
    }
  },

  getConfig() {
    const extra = Constants.expoConfig?.extra || {}
    return {
      nativeAppKey: extra.kakaoNativeAppKey || process.env.KAKAO_NATIVE_APP_KEY,
      restApiKey: extra.kakaoRestApiKey || process.env.KAKAO_REST_API_KEY,
    }
  },
}
