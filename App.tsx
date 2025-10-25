import React, { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { RootNavigator } from '@/navigation/RootNavigator'
import { useTheme } from '@/hooks/useTheme'
import { kakaoAuth } from '@/services/kakaoAuth'
import { googleAuth } from '@/services/googleAuth'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
})

const AppContent: React.FC = () => {
  const { isDark } = useTheme()

  useEffect(() => {
    kakaoAuth.initialize()
    googleAuth.initialize()
  }, [])

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator />
    </>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={styles.root}>
          <AppContent />
        </GestureHandlerRootView>
      </QueryClientProvider>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
})
