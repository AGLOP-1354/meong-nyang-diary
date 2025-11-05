import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { signInWithOAuthMobile, signInWithApple } from '@/lib/auth/supabaseAuth';
import type { User, Session } from '@supabase/supabase-js';

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithOAuth: (provider: 'kakao' | 'google' | 'apple') => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  setLoading: (isLoading: boolean) => void;
  checkAuthStatus: () => Promise<void>;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
  isAuthenticated: false,
  user: null,
  session: null,
  isLoading: true,

  // 이메일/비밀번호 로그인
  signInWithEmail: async (email: string, password: string) => {
    try {
      set({ isLoading: true });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      set({
        isAuthenticated: true,
        user: data.user,
        session: data.session,
        isLoading: false,
      });

      return { error: null };
    } catch (error) {
      set({ isLoading: false });
      return { error: error as Error };
    }
  },

  // OAuth 로그인 (Kakao, Google, Apple)
  signInWithOAuth: async (provider: 'kakao' | 'google' | 'apple') => {
    try {
      set({ isLoading: true });

      let result;

      // Apple은 네이티브 로그인 사용
      if (provider === 'apple') {
        result = await signInWithApple();
      } else {
        // Kakao, Google은 웹 OAuth 사용
        result = await signInWithOAuthMobile(provider);
      }

      if (result.error) {
        set({ isLoading: false });
        return { error: result.error };
      }

      // 세션이 성공적으로 생성되면 onAuthStateChange가 자동으로 상태 업데이트
      set({ isLoading: false });
      return { error: null };
    } catch (error) {
      set({ isLoading: false });
      return { error: error as Error };
    }
  },

  // 로그아웃
  signOut: async () => {
    try {
      set({ isLoading: true });
      await supabase.auth.signOut();
      set({
        isAuthenticated: false,
        user: null,
        session: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('로그아웃 오류:', error);
      set({ isLoading: false });
    }
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  // 인증 상태 확인
  checkAuthStatus: async () => {
    try {
      set({ isLoading: true });
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        set({
          isAuthenticated: true,
          user: session.user,
          session: session,
          isLoading: false,
        });
      } else {
        set({
          isAuthenticated: false,
          user: null,
          session: null,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('인증 상태 확인 중 오류:', error);
      set({
        isAuthenticated: false,
        user: null,
        session: null,
        isLoading: false,
      });
    }
  },

  // Auth 상태 변경 리스너 초기화
  initializeAuth: () => {
    // 초기 세션 확인
    get().checkAuthStatus();

    // Auth 상태 변경 리스너
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        set({
          isAuthenticated: true,
          user: session.user,
          session: session,
          isLoading: false,
        });
      } else {
        set({
          isAuthenticated: false,
          user: null,
          session: null,
          isLoading: false,
        });
      }
    });
  },
}));
