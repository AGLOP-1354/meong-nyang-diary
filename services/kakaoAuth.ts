import { initializeKakaoSDK } from '@react-native-kakao/core';
import {
  login as kakaoLogin,
  me as getKakaoProfile,
  logout as kakaoLogout,
  isLogined,
  type KakaoUser,
  type KakaoLoginToken,
} from '@react-native-kakao/user';
import Constants from 'expo-constants';
import logger from '../libs/utils/logger';

export type KakaoAuthUser = {
  id: number;
  nickname: string;
  email?: string;
  profileImageUrl?: string;
};

export type KakaoLoginResult =
  | { success: true; user: KakaoAuthUser }
  | { success: false; error: string; code?: string };

export type KakaoLogoutResult = { success: true } | { success: false; error: string };

type KakaoConfig = {
  nativeAppKey?: string;
  restApiKey?: string;
};

enum KakaoAuthErrorCode {
  CANCELLED = 'CANCELLED',
  BUNDLE_ID_VALIDATION_FAILED = 'BUNDLE_ID_VALIDATION_FAILED',
  SDK_NOT_INITIALIZED = 'SDK_NOT_INITIALIZED',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  UNKNOWN = 'UNKNOWN',
}

const mapKakaoUserToAuthUser = (kakaoUser: KakaoUser): KakaoAuthUser => {
  return {
    id: kakaoUser.id,
    nickname: kakaoUser.nickname,
    email: kakaoUser.email || undefined,
    profileImageUrl: kakaoUser.profileImageUrl || undefined,
  };
};

const getErrorMessage = (error: unknown): { message: string; code: string } => {
  if (!error || typeof error !== 'object') {
    return { message: '카카오 로그인에 실패했습니다.', code: KakaoAuthErrorCode.UNKNOWN };
  }

  const err = error as { code?: number | string; message?: string };

  if (err.message) {
    if (err.message.includes('bundleId validation failed')) {
      return {
        message: 'iOS bundleId 검증 실패: 카카오 개발자 콘솔에 번들 ID를 정확히 등록해주세요.',
        code: KakaoAuthErrorCode.BUNDLE_ID_VALIDATION_FAILED,
      };
    }

    if (err.message.includes('SdkError error 2') || err.message.includes('SdkError error 0')) {
      return {
        message: 'SDK 초기화/설정 문제입니다. 앱을 재빌드하거나 키 설정을 확인해주세요.',
        code: KakaoAuthErrorCode.SDK_NOT_INITIALIZED,
      };
    }

    if (err.message.toLowerCase().includes('cancel')) {
      return {
        message: '사용자가 로그인을 취소했습니다.',
        code: KakaoAuthErrorCode.CANCELLED,
      };
    }

    return {
      message: err.message,
      code: err.code?.toString() || KakaoAuthErrorCode.UNKNOWN,
    };
  }

  return {
    message: '카카오 로그인에 실패했습니다.',
    code: err.code?.toString() || KakaoAuthErrorCode.UNKNOWN,
  };
};

export const kakaoAuth = {
  async initialize(): Promise<void> {
    const config = this.getConfig();

    if (!config.nativeAppKey) {
      logger.error('[KakaoAuth] nativeAppKey가 설정되지 않았습니다. app.json의 extra.kakaoNativeAppKey를 확인하세요.');
      return;
    }

    try {
      await initializeKakaoSDK(config.nativeAppKey);
      logger.info('[KakaoAuth] 카카오 SDK 초기화 완료');
    } catch (error) {
      logger.error('[KakaoAuth] 카카오 SDK 초기화 실패:', error);
      throw error;
    }
  },

  async login(): Promise<KakaoLoginResult> {
    try {
      const token: KakaoLoginToken = await kakaoLogin();

      if (!token || !token.accessToken) {
        return {
          success: false,
          error: '로그인 토큰을 받을 수 없습니다. 다시 시도해주세요.',
          code: KakaoAuthErrorCode.UNKNOWN,
        };
      }

      const profile: KakaoUser = await getKakaoProfile();

      if (!profile || !profile.id) {
        return {
          success: false,
          error: '프로필 정보를 가져올 수 없습니다.',
          code: KakaoAuthErrorCode.UNKNOWN,
        };
      }

      const user = mapKakaoUserToAuthUser(profile);

      logger.info('[KakaoAuth] 로그인 성공:', user.nickname);
      return { success: true, user };
    } catch (error) {
      const { message, code } = getErrorMessage(error);
      logger.error('[KakaoAuth] 로그인 실패:', { error, code });
      return { success: false, error: message, code };
    }
  },

  async logout(): Promise<KakaoLogoutResult> {
    try {
      await kakaoLogout();
      logger.info('[KakaoAuth] 로그아웃 성공');
      return { success: true };
    } catch (error) {
      logger.error('[KakaoAuth] 로그아웃 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '로그아웃에 실패했습니다.',
      };
    }
  },

  async isLoggedIn(): Promise<boolean> {
    try {
      return await isLogined();
    } catch (error) {
      logger.error('[KakaoAuth] 로그인 상태 확인 실패:', error);
      return false;
    }
  },

  getConfig(): KakaoConfig {
    const extra = Constants.expoConfig?.extra ?? {};
    return {
      nativeAppKey: (extra.kakaoNativeAppKey as string) ?? process.env.KAKAO_NATIVE_APP_KEY,
      restApiKey: (extra.kakaoRestApiKey as string) ?? process.env.KAKAO_REST_API_KEY,
    };
  },
};
