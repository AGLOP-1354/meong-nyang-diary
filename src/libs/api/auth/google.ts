import { googleAuth } from '@/services/googleAuth'
import { apiClient, ApiError } from '@/libs/api/client'
import logger from '@/libs/utils/logger'

import type { GoogleLoginRequest, LoginResponse, LoginResult } from './types'
import { SocialPlatform as SocialPlatformEnum } from './types'

export const googleAuthApi = {
  async login(source: string = 'app'): Promise<LoginResult> {
    try {
      const googleResult = await googleAuth.login()

      if (!googleResult.success) {
        return {
          success: false,
          error: googleResult.error,
          code: googleResult.code,
        }
      }

      const { user } = googleResult

      const loginRequest: GoogleLoginRequest = {
        googleId: user.id,
        name: user.name || user.email,
        email: user.email,
        profileImage: user.profileImageUrl,
        socialPlatform: SocialPlatformEnum.GOOGLE,
        source,
      }

      const response = await apiClient.post<LoginResponse>('/user/login', loginRequest)

      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      logger.error('[GoogleAuthAPI] 로그인 실패:', error)

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
      const result = await googleAuth.logout()

      if (!result.success) {
        return {
          success: false,
          error: result.error,
        }
      }

      return { success: true }
    } catch (error) {
      logger.error('[GoogleAuthAPI] 로그아웃 실패:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '로그아웃에 실패했습니다.',
      }
    }
  },

  hasPreviousSignIn(): boolean {
    return googleAuth.hasPreviousSignIn()
  },

  getCurrentUser() {
    return googleAuth.getCurrentUser()
  },
}
