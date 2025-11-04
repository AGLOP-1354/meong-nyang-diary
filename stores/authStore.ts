import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { UserType } from '@/types/user';

interface AuthStore {
  isAuthenticated: boolean;
  user: UserType | null;
  isLoading: boolean;
  login: (user: UserType) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
  checkAuthStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      isLoading: true,

      login: (user: UserType) => {
        set({
          isAuthenticated: true,
          user,
          isLoading: false,
        } as Partial<AuthStore>);
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        } as Partial<AuthStore>);
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading } as Partial<AuthStore>);
      },

      checkAuthStatus: async () => {
        try {
          set({ isLoading: false } as Partial<AuthStore>);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('인증 상태 확인 중 오류:', error);
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          } as Partial<AuthStore>);
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state: AuthStore) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
      onRehydrateStorage: () => (state: AuthStore | undefined) => {
        if (state) {
          state.setLoading(false);
        }
      },
    },
  ),
);
