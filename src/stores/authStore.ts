import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { UserType, AuthState } from '@/types/user'

interface AuthStore extends AuthState {
  login: (user: UserType) => void
  logout: () => void
  setLoading: (isLoading: boolean) => void
  checkAuthStatus: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      isAuthenticated: false,
      user: null,
      isLoading: true,

      login: (user: UserType) => {
        set({
          isAuthenticated: true,
          user,
          isLoading: false,
        })
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        })
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading })
      },

      checkAuthStatus: async () => {
        try {
          set({ isLoading: false })
        } catch (error) {
          console.error('인증 상태 확인 중 오류:', error)
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          })
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
      onRehydrateStorage: () => state => {
        if (state) {
          state.setLoading(false)
        }
      },
    },
  ),
)
