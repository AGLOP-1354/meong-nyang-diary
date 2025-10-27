import { kakaoAuth } from '@/services/kakaoAuth'
import { apiClient, ApiError } from '@/libs/api/client'
import logger from '@/libs/utils/logger'

import type { KakaoLoginRequest, LoginResponse, LoginResult } from './types'
import { SocialPlatform as SocialPlatformEnum } from './types'

export const kakaoAuthApi = {
  async login(source: string = 'app'): Promise<LoginResult> {
    try {
      const kakaoResult = await kakaoAuth.login()

      if (!kakaoResult.success) {
        return {
          success: false,
          error: kakaoResult.error,
          code: kakaoResult.code,
        }
      }

      const { user } = kakaoResult

      const loginRequest: KakaoLoginRequest = {
        kakaoId: user.id.toString(),
        name: user.nickname,
        email: user.email || '',
        profileImage: user.profileImageUrl,
        socialPlatform: SocialPlatformEnum.KAKAO,
        source,
      }

      const response = await apiClient.post<LoginResponse>('/user/login', loginRequest)

      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      logger.error('[KakaoAuthAPI] 로그인 실패:', error)

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
      const result = await kakaoAuth.logout()

      if (!result.success) {
        return {
          success: false,
          error: result.error,
        }
      }

      return { success: true }
    } catch (error) {
      logger.error('[KakaoAuthAPI] 로그아웃 실패:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '로그아웃에 실패했습니다.',
      }
    }
  },

  async isLoggedIn(): Promise<boolean> {
    return await kakaoAuth.isLoggedIn()
  },
}
