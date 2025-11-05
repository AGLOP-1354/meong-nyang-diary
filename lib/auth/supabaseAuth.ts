/**
 * Supabase OAuth Helper for React Native/Expo
 * PKCE flow를 사용한 모바일 OAuth 인증
 */

import { supabase } from '@/lib/supabase';
import { Platform } from 'react-native';

/**
 * 랜덤 문자열 생성 (PKCE code verifier용)
 */
function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

/**
 * Supabase OAuth 로그인 (모바일)
 */
export async function signInWithOAuthMobile(provider: 'kakao' | 'google' | 'apple') {
  try {
    // Dynamic imports
    const WebBrowser = await import('expo-web-browser');
    const AuthSession = await import('expo-auth-session');
    const Crypto = await import('expo-crypto');

    // WebBrowser 세션 완료 처리 (iOS)
    WebBrowser.maybeCompleteAuthSession();

    // PKCE 생성
    const codeVerifier = generateRandomString(128);
    const codeChallenge = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      codeVerifier,
      { encoding: Crypto.CryptoEncoding.BASE64 }
    );

    // Base64 URL-safe로 변환
    const codeChallengeFormatted = codeChallenge
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    // Redirect URL 설정 (더 단순한 형식)
    const redirectUrl = AuthSession.makeRedirectUri({
      scheme: 'meong-nyang-diary',
    });

    console.log('Redirect URL:', redirectUrl);

    // Supabase OAuth URL 생성
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: true,
        scopes: provider === 'kakao' ? 'account_email profile_nickname' : undefined,
      },
    });

    if (error) throw error;
    if (!data?.url) throw new Error('OAuth URL을 가져올 수 없습니다.');

    // OAuth URL에 PKCE 추가
    const oauthUrl = `${data.url}&code_challenge=${codeChallengeFormatted}&code_challenge_method=S256`;

    console.log('Opening OAuth URL:', oauthUrl);

    // WebBrowser로 OAuth 페이지 열기
    const result = await WebBrowser.openAuthSessionAsync(oauthUrl, redirectUrl, {
      showInRecents: false,
    });

    if (result.type !== 'success') {
      console.log('OAuth cancelled or failed:', result);
      return { error: new Error('로그인이 취소되었습니다.') };
    }

    console.log('OAuth result:', result);

    // 콜백 URL에서 코드 추출
    const url = new URL(result.url);
    const code = url.searchParams.get('code');

    if (!code) {
      return { error: new Error('인증 코드를 받지 못했습니다.') };
    }

    console.log('Exchanging code for session...');

    // 코드를 세션으로 교환
    const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      console.error('Session exchange error:', sessionError);
      throw sessionError;
    }

    console.log('Session created successfully');

    return { data: sessionData, error: null };
  } catch (error) {
    console.error('OAuth error:', error);
    return { error: error as Error };
  }
}

/**
 * Apple Sign In (네이티브)
 */
export async function signInWithApple() {
  if (Platform.OS !== 'ios') {
    return { error: new Error('Apple 로그인은 iOS에서만 사용 가능합니다.') };
  }

  try {
    // Dynamic import
    const AppleAuthentication = await import('expo-apple-authentication');

    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    console.log('Apple credential:', credential);

    // Supabase에 Apple ID Token 전달
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: credential.identityToken!,
    });

    if (error) throw error;

    return { data, error: null };
  } catch (error: any) {
    if (error.code === 'ERR_REQUEST_CANCELED') {
      return { error: new Error('로그인이 취소되었습니다.') };
    }
    console.error('Apple sign in error:', error);
    return { error: error as Error };
  }
}
