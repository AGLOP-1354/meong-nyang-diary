import type { UserType } from '@/types/user'

export enum SocialPlatform {
  GOOGLE = 'GOOGLE',
  KAKAO = 'KAKAO',
  APPLE = 'APPLE',
}

export type LoginSource = 'app' | 'landing' | string

export interface GoogleLoginRequest {
  googleId: string
  name: string
  email: string
  profileImage?: string
  socialPlatform: SocialPlatform.GOOGLE
  source: LoginSource
}

export interface KakaoLoginRequest {
  kakaoId: string
  name: string
  email: string
  profileImage?: string
  socialPlatform: SocialPlatform.KAKAO
  source: LoginSource
}

export interface AppleLoginRequest {
  appleId: string
  name?: string
  email?: string
  profileImage?: string
  socialPlatform: SocialPlatform.APPLE
  source: LoginSource
}

export type LoginRequest = GoogleLoginRequest | KakaoLoginRequest | AppleLoginRequest

export interface LoginResponse {
  accessToken: string
  isNewUser: boolean
  user?: UserType
}

export type LoginResult =
  | {
      success: true
      data: LoginResponse
    }
  | {
      success: false
      error: string
      code?: string
    }

export interface LogoutResponse {
  success: boolean
  message?: string
}

export interface UserInfoResponse {
  user: UserType
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken?: string
}
