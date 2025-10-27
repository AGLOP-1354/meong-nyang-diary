import { appleAuth } from '@/services/appleAuth'
import { apiClient, ApiError } from '@/libs/api/client'
import logger from '@/libs/utils/logger'

import type { AppleLoginRequest, LoginResponse, LoginResult } from './types'
import { SocialPlatform as SocialPlatformEnum } from './types'

export const appleAuthApi = {
  async login(source: string = 'app'): Promise<LoginResult> {
    try {
      const appleResult = await appleAuth.login()

      if (!appleResult.success) {
        return {
          success: false,
          error: appleResult.error,
          code: appleResult.code || 'APPLE_LOGIN_FAILED',
        }
      }

      const { user } = appleResult

      const loginRequest: AppleLoginRequest = {
        appleId: user.id,
        name: user.name,
        email: user.email,
        profileImage: undefined, // apple 로그인은 프로필 이미지를 제공하지 않음
        socialPlatform: SocialPlatformEnum.APPLE,
        source,
      }

      const response = await apiClient.post<LoginResponse>('/user/login', loginRequest)

      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      logger.error('[AppleAuthAPI] 로그인 실패:', error)

      if (error instanceof ApiError) {
        return {
          success: false,
          error: error.message,
          code: error.statusCode.toString(),
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        code: 'UNKNOWN_ERROR',
      }
    }
  },

  async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await appleAuth.logout()

      if (!result.success) {
        return {
          success: false,
          error: result.error,
        }
      }

      return { success: true }
    } catch (error) {
      logger.error('[AppleAuthAPI] 로그아웃 실패:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '로그아웃에 실패했습니다.',
      }
    }
  },

  async isAvailable(): Promise<boolean> {
    return await appleAuth.isAvailable()
  },

  async isAuthorized(userId: string): Promise<boolean> {
    return await appleAuth.isAuthorized(userId)
  },
}
