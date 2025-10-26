import * as AppleAuthentication from 'expo-apple-authentication'
import { Platform } from 'react-native'

import logger from '../utils/logger'

export type AppleAuthUser = {
  id: string
  name?: string
  email?: string
}

export type AppleLoginResult = { success: true; user: AppleAuthUser } | { success: false; error: string; code?: string }

export type AppleLogoutResult = { success: true } | { success: false; error: string }

enum AppleAuthErrorCode {
  CANCELLED = 'ERR_REQUEST_CANCELED',
  INVALID_OPERATION = 'ERR_INVALID_OPERATION',
  REQUEST_FAILED = 'ERR_REQUEST_FAILED',
  NOT_HANDLED = 'ERR_REQUEST_NOT_HANDLED',
  NOT_INTERACTIVE = 'ERR_REQUEST_NOT_INTERACTIVE',
  UNKNOWN = 'ERR_REQUEST_UNKNOWN',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
  SIMULATOR_NOT_SUPPORTED = 'SIMULATOR_NOT_SUPPORTED',
}

const formatAppleUserName = (fullName: AppleAuthentication.AppleAuthenticationFullName | null): string | undefined => {
  if (!fullName) return undefined
  const nameParts = [fullName.givenName, fullName.familyName].filter(Boolean)

  return nameParts.length > 0 ? nameParts.join(' ') : undefined
}

const getErrorMessage = (error: unknown): { message: string; code: string } => {
  if (!error || typeof error !== 'object')
    return { message: 'Apple 로그인에 실패했습니다.', code: AppleAuthErrorCode.UNKNOWN }

  const err = error as { code?: string; message?: string }

  switch (err.code) {
    case AppleAuthErrorCode.CANCELLED:
      return {
        message: '사용자가 로그인을 취소했습니다.',
        code: AppleAuthErrorCode.CANCELLED,
      }
    case AppleAuthErrorCode.INVALID_OPERATION:
      return {
        message: '잘못된 작업입니다. 앱 설정을 확인해주세요.',
        code: AppleAuthErrorCode.INVALID_OPERATION,
      }
    case AppleAuthErrorCode.REQUEST_FAILED:
      return {
        message: '로그인 요청이 실패했습니다. 네트워크를 확인해주세요.',
        code: AppleAuthErrorCode.REQUEST_FAILED,
      }
    case AppleAuthErrorCode.NOT_HANDLED:
      return {
        message: '로그인 요청을 처리할 수 없습니다.',
        code: AppleAuthErrorCode.NOT_HANDLED,
      }
    case AppleAuthErrorCode.NOT_INTERACTIVE:
      return {
        message: '대화형 로그인 요청이 아닙니다.',
        code: AppleAuthErrorCode.NOT_INTERACTIVE,
      }
    case AppleAuthErrorCode.UNKNOWN:
      return {
        message: '알 수 없는 오류가 발생했습니다.',
        code: AppleAuthErrorCode.UNKNOWN,
      }
    default:
      // 시뮬레이터 미지원 감지
      if (err.message?.includes('unknown reason')) {
        return {
          message: 'Apple 로그인은 실제 iOS 기기에서만 사용 가능합니다. (시뮬레이터 미지원)',
          code: AppleAuthErrorCode.SIMULATOR_NOT_SUPPORTED,
        }
      }

      return {
        message: err.message || 'Apple 로그인에 실패했습니다.',
        code: err.code || AppleAuthErrorCode.UNKNOWN,
      }
  }
}

export const appleAuth = {
  async isAvailable(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      logger.warn('[AppleAuth] Apple 로그인은 iOS에서만 사용 가능합니다.')
      return false
    }

    try {
      const available = await AppleAuthentication.isAvailableAsync()
      logger.info('[AppleAuth] Apple 로그인 가용성:', available)
      return available
    } catch (error) {
      logger.error('[AppleAuth] Apple 로그인 가용성 확인 실패:', error)
      return false
    }
  },

  async login(): Promise<AppleLoginResult> {
    try {
      const available = await this.isAvailable()
      if (!available) {
        return {
          success: false,
          error: 'Apple 로그인은 iOS 13 이상의 실제 기기에서만 사용 가능합니다.',
          code: AppleAuthErrorCode.NOT_AVAILABLE,
        }
      }

      const credential: AppleAuthentication.AppleAuthenticationCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      })

      if (!credential?.user) {
        return {
          success: false,
          error: '로그인 정보를 받을 수 없습니다. 다시 시도해주세요.',
          code: AppleAuthErrorCode.UNKNOWN,
        }
      }

      const user: AppleAuthUser = {
        id: credential.user,
        name: formatAppleUserName(credential.fullName),
        email: credential.email ?? undefined,
      }

      logger.info('[AppleAuth] 로그인 성공:', user.id)
      return { success: true, user }
    } catch (error) {
      const { message, code } = getErrorMessage(error)
      logger.error('[AppleAuth] 로그인 실패:', { error, code })
      return { success: false, error: message, code }
    }
  },

  async logout(): Promise<AppleLogoutResult> {
    logger.info('[AppleAuth] 로그아웃 (클라이언트 측 데이터 삭제 필요)')
    return { success: true }
  },

  async getCredentialState(userId: string): Promise<AppleAuthentication.AppleAuthenticationCredentialState | null> {
    if (Platform.OS !== 'ios') {
      return null
    }

    try {
      const state = await AppleAuthentication.getCredentialStateAsync(userId)
      logger.info('[AppleAuth] 자격 증명 상태:', state)
      return state
    } catch (error) {
      logger.error('[AppleAuth] 자격 증명 상태 확인 실패:', error)
      return null
    }
  },

  async isAuthorized(userId: string): Promise<boolean> {
    try {
      const state = await this.getCredentialState(userId)
      return state === AppleAuthentication.AppleAuthenticationCredentialState.AUTHORIZED
    } catch (error) {
      logger.error('[AppleAuth] 인증 상태 확인 실패:', error)
      return false
    }
  },
}
