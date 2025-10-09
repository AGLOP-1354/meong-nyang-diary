import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'
import Constants from 'expo-constants'
import { Platform } from 'react-native'

export type GoogleAuthUser = {
  id: string
  name?: string
  email?: string
  profileImageUrl?: string
}

export type GoogleLoginResult = { success: true; user: GoogleAuthUser } | { success: false; error: string }

export const googleAuth = {
  initialize(): void {
    const config = this.getConfig()
    try {
      GoogleSignin.configure({
        iosClientId: Platform.OS === 'ios' ? config.iosClientId : undefined,
        webClientId: config.webClientId,
        offlineAccess: true,
        hostedDomain: '',
        forceCodeForRefreshToken: true,
      })
    } catch (error) {
      console.error('Google SDK 초기화 실패:', error)
    }
  },

  async login(): Promise<GoogleLoginResult> {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })

      const userInfo: any = await GoogleSignin.signIn()

      if (!userInfo?.data?.user) {
        return { success: false, error: '로그인 결과를 받을 수 없습니다.' }
      }

      const googleUser = userInfo.data.user

      const user: GoogleAuthUser = {
        id: googleUser.id,
        name: googleUser.name || undefined,
        email: googleUser.email,
        profileImageUrl: googleUser.photo || undefined,
      }

      return { success: true, user }
    } catch (error: any) {
      let message = 'Google 로그인에 실패했습니다.'

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        message = '사용자가 로그인을 취소했습니다.'
      } else if (error.code === statusCodes.IN_PROGRESS) {
        message = '로그인이 이미 진행 중입니다.'
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        message = 'Google Play Services를 사용할 수 없습니다.'
      } else if (error.message) {
        message = error.message
      }

      return { success: false, error: message }
    }
  },

  async logout(): Promise<boolean> {
    try {
      await GoogleSignin.signOut()
      return true
    } catch {
      return false
    }
  },

  async getCurrentUser(): Promise<GoogleAuthUser | null> {
    try {
      const currentUser: any = await GoogleSignin.getCurrentUser()
      if (currentUser?.user) {
        const googleUser = currentUser.user
        return {
          id: googleUser.id,
          name: googleUser.name || undefined,
          email: googleUser.email,
          profileImageUrl: googleUser.photo || undefined,
        }
      }
      return null
    } catch {
      return null
    }
  },

  getConfig() {
    const extra = Constants.expoConfig?.extra || {}
    return {
      iosClientId: extra.googleIosClientId || process.env.GOOGLE_IOS_CLIENT_ID,
      androidClientId: extra.googleAndroidClientId || process.env.GOOGLE_ANDROID_CLIENT_ID,
      webClientId: extra.googleWebClientId || process.env.GOOGLE_WEB_CLIENT_ID,
    }
  },
}
