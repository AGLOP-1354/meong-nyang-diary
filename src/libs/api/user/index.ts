import { apiClient, ApiError } from '@/libs/api/client'
import logger from '@/libs/utils/logger'
import type { UserType } from '@/types/user'

export interface UserInfoResponse {
  user: UserType
}

export const userApi = {
  async getMe(): Promise<{ success: boolean; user?: UserType; error?: string }> {
    try {
      const response = await apiClient.get<UserInfoResponse>('/user')

      return {
        success: true,
        user: response.data.user,
      }
    } catch (error) {
      logger.error('[UserAPI] 사용자 정보 조회 실패:', error)

      if (error instanceof ApiError) {
        return {
          success: false,
          error: error.message,
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : '사용자 정보를 가져올 수 없습니다.',
      }
    }
  },

  async updateProfile(data: Partial<UserType>): Promise<{ success: boolean; user?: UserType; error?: string }> {
    try {
      const response = await apiClient.put<UserInfoResponse>('/user/profile', data)

      return {
        success: true,
        user: response.data.user,
      }
    } catch (error) {
      logger.error('[UserAPI] 프로필 업데이트 실패:', error)

      if (error instanceof ApiError) {
        return {
          success: false,
          error: error.message,
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : '프로필 업데이트에 실패했습니다.',
      }
    }
  },
}
