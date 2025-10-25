import * as AppleAuthentication from 'expo-apple-authentication'
import { Platform } from 'react-native'

export type AppleAuthUser = {
  id: string
  name?: string
  email?: string
}

export type AppleLoginResult = { success: true; user: AppleAuthUser } | { success: false; error: string }

export const appleAuth = {
  async isAvailable(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      return false
    }

    try {
      return await AppleAuthentication.isAvailableAsync()
    } catch {
      return false
    }
  },

  async login(): Promise<AppleLoginResult> {
    try {
      const available = await this.isAvailable()
      if (!available) {
        return { success: false, error: 'Apple 로그인은 iOS 기기에서만 사용 가능합니다.' }
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      })

      if (!credential || !credential.user) {
        return { success: false, error: '로그인 정보를 받을 수 없습니다.' }
      }

      const fullName = credential.fullName
      const name = fullName ? [fullName.givenName, fullName.familyName].filter(Boolean).join(' ') : undefined

      const user: AppleAuthUser = {
        id: credential.user,
        name: name || undefined,
        email: credential.email || undefined,
      }

      return { success: true, user }
    } catch (error: any) {
      let message = 'Apple 로그인에 실패했습니다.'

      if (error.code === 'ERR_REQUEST_CANCELED') {
        message = '사용자가 로그인을 취소했습니다.'
      } else if (error.code === 'ERR_INVALID_OPERATION') {
        message = '잘못된 작업입니다.'
      } else if (error.code === 'ERR_REQUEST_FAILED') {
        message = '로그인 요청이 실패했습니다.'
      } else if (error.code === 'ERR_REQUEST_NOT_HANDLED') {
        message = '로그인 요청을 처리할 수 없습니다.'
      } else if (error.code === 'ERR_REQUEST_NOT_INTERACTIVE') {
        message = '대화형 로그인 요청이 아닙니다.'
      } else if (error.code === 'ERR_REQUEST_UNKNOWN') {
        message = '알 수 없는 오류가 발생했습니다.'
      } else if (error.message && error.message.includes('unknown reason')) {
        message = 'Apple 로그인은 실제 iOS 기기에서만 사용 가능합니다. (시뮬레이터 미지원)'
      } else if (error.message) {
        message = error.message
      }

      return { success: false, error: message }
    }
  },

  async logout(): Promise<boolean> {
    return true
  },
}
