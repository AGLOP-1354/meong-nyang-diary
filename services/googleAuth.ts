import { GoogleSignin, statusCodes, type User } from '@react-native-google-signin/google-signin';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import logger from '../libs/utils/logger';

export type GoogleAuthUser = {
  id: string;
  name?: string;
  email: string;
  profileImageUrl?: string;
};

export type GoogleLoginResult =
  | { success: true; user: GoogleAuthUser }
  | { success: false; error: string; code?: string };

export type GoogleLogoutResult = { success: true } | { success: false; error: string };

type GoogleConfig = {
  iosClientId?: string;
  androidClientId?: string;
  webClientId?: string;
};

enum GoogleAuthErrorCode {
  CANCELLED = 'CANCELLED',
  IN_PROGRESS = 'IN_PROGRESS',
  PLAY_SERVICES_NOT_AVAILABLE = 'PLAY_SERVICES_NOT_AVAILABLE',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  UNKNOWN = 'UNKNOWN',
}

const mapGoogleUserToAuthUser = (googleUser: User): GoogleAuthUser => {
  return {
    id: googleUser.user.id,
    name: googleUser.user.name ?? undefined,
    email: googleUser.user.email,
    profileImageUrl: googleUser.user.photo ?? undefined,
  };
};

const getErrorMessage = (error: unknown): { message: string; code: string } => {
  if (!error || typeof error !== 'object')
    return { message: 'Google 로그인에 실패했습니다.', code: GoogleAuthErrorCode.UNKNOWN };

  const err = error as { code?: string; message?: string };

  switch (err.code) {
    case statusCodes.SIGN_IN_CANCELLED:
      return { message: '사용자가 로그인을 취소했습니다.', code: GoogleAuthErrorCode.CANCELLED };
    case statusCodes.IN_PROGRESS:
      return { message: '로그인이 이미 진행 중입니다.', code: GoogleAuthErrorCode.IN_PROGRESS };
    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
      return {
        message: 'Google Play Services를 사용할 수 없습니다. 최신 버전으로 업데이트해주세요.',
        code: GoogleAuthErrorCode.PLAY_SERVICES_NOT_AVAILABLE,
      };
    default:
      return {
        message: err.message || 'Google 로그인에 실패했습니다.',
        code: err.code || GoogleAuthErrorCode.UNKNOWN,
      };
  }
};

export const googleAuth = {
  initialize(): void {
    const config = this.getConfig();

    if (!config.webClientId) {
      logger.error('[GoogleAuth] webClientId가 설정되지 않았습니다. app.json의 extra.googleWebClientId를 확인하세요.');
      return;
    }

    if (Platform.OS === 'ios' && !config.iosClientId) {
      logger.warn(
        '[GoogleAuth] iOS에서 iosClientId가 설정되지 않았습니다. app.json의 extra.googleIosClientId를 확인하세요.',
      );
    }

    if (Platform.OS === 'android' && !config.androidClientId) {
      logger.warn(
        '[GoogleAuth] Android에서 androidClientId가 설정되지 않았습니다. app.json의 extra.googleAndroidClientId를 확인하세요.',
      );
    }

    try {
      GoogleSignin.configure({
        iosClientId: Platform.OS === 'ios' ? config.iosClientId : undefined,
        webClientId: config.webClientId,
        offlineAccess: true,
        forceCodeForRefreshToken: true,
      });

      logger.info('[GoogleAuth] Google SDK 초기화 완료');
    } catch (error) {
      logger.error('[GoogleAuth] Google SDK 초기화 실패:', error);
      throw error;
    }
  },

  async login(): Promise<GoogleLoginResult> {
    try {
      if (Platform.OS === 'android') {
        const hasPlayServices = await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });

        if (!hasPlayServices) {
          return {
            success: false,
            error: 'Google Play Services를 사용할 수 없습니다.',
            code: GoogleAuthErrorCode.PLAY_SERVICES_NOT_AVAILABLE,
          };
        }
      }

      const response = await GoogleSignin.signIn();

      if (response.type === 'cancelled') {
        return {
          success: false,
          error: '사용자가 로그인을 취소했습니다.',
          code: GoogleAuthErrorCode.CANCELLED,
        };
      }

      if (!response.data) {
        return {
          success: false,
          error: '로그인 결과를 받을 수 없습니다. 다시 시도해주세요.',
          code: GoogleAuthErrorCode.UNKNOWN,
        };
      }

      const user = mapGoogleUserToAuthUser(response.data);

      logger.info('[GoogleAuth] 로그인 성공:', user.email);
      return { success: true, user };
    } catch (error) {
      const { message, code } = getErrorMessage(error);
      logger.error('[GoogleAuth] 로그인 실패:', { error, code });
      return { success: false, error: message, code };
    }
  },

  async logout(): Promise<GoogleLogoutResult> {
    try {
      await GoogleSignin.signOut();
      logger.info('[GoogleAuth] 로그아웃 성공');
      return { success: true };
    } catch (error) {
      logger.error('[GoogleAuth] 로그아웃 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '로그아웃에 실패했습니다.',
      };
    }
  },

  getCurrentUser(): GoogleAuthUser | null {
    try {
      const currentUser = GoogleSignin.getCurrentUser();

      if (!currentUser) {
        return null;
      }

      return mapGoogleUserToAuthUser(currentUser);
    } catch (error) {
      logger.error('[GoogleAuth] 현재 사용자 조회 실패:', error);
      return null;
    }
  },

  hasPreviousSignIn(): boolean {
    try {
      return GoogleSignin.hasPreviousSignIn();
    } catch (error) {
      logger.error('[GoogleAuth] 로그인 상태 확인 실패:', error);
      return false;
    }
  },

  getConfig(): GoogleConfig {
    const extra = Constants.expoConfig?.extra ?? {};
    return {
      iosClientId: (extra.googleIosClientId as string) ?? process.env.GOOGLE_IOS_CLIENT_ID,
      androidClientId: (extra.googleAndroidClientId as string) ?? process.env.GOOGLE_ANDROID_CLIENT_ID,
      webClientId: (extra.googleWebClientId as string) ?? process.env.GOOGLE_WEB_CLIENT_ID,
    };
  },
};
