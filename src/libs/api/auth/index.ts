import logger from '@/libs/utils/logger'
import { getItem, setItem, removeItem } from '@/libs/utils/storage'

import { googleAuthApi } from './google'
import { kakaoAuthApi } from './kakao'
import { appleAuthApi } from './apple'
import { SocialPlatform } from './types'

export const TOKEN_STORAGE_KEY = 'auth_token'
export const PLATFORM_STORAGE_KEY = 'auth_platform'

export const authApi = {
  google: googleAuthApi,
  kakao: kakaoAuthApi,

  apple: appleAuthApi,
  async saveToken(token: string, platform: SocialPlatform): Promise<void> {
    await setItem(TOKEN_STORAGE_KEY, token)
    await setItem(PLATFORM_STORAGE_KEY, platform)
  },

  async getToken(): Promise<string | null> {
    return await getItem<string>(TOKEN_STORAGE_KEY)
  },

  async getPlatform(): Promise<SocialPlatform | null> {
    return await getItem<SocialPlatform>(PLATFORM_STORAGE_KEY)
  },

  async clearToken(): Promise<void> {
    await removeItem(TOKEN_STORAGE_KEY)
    await removeItem(PLATFORM_STORAGE_KEY)
  },

  async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      const platform = await this.getPlatform()

      if (platform) {
        switch (platform) {
          case SocialPlatform.GOOGLE:
            await googleAuthApi.logout()
            break
          case SocialPlatform.KAKAO:
            await kakaoAuthApi.logout()
            break
          case SocialPlatform.APPLE:
            await appleAuthApi.logout()
            break
        }
      }

      await this.clearToken()

      return { success: true }
    } catch (error) {
      logger.error('[AuthAPI] 통합 로그아웃 실패:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '로그아웃에 실패했습니다.',
      }
    }
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken()
    return !!token
  },
}

export * from './types'
export { googleAuthApi, kakaoAuthApi, appleAuthApi }
