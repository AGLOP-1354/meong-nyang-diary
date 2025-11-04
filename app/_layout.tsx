import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { QueryClientProvider } from '@tanstack/react-query';

import { useAuthStore } from '@/stores/authStore';
import { kakaoAuth } from '@/services/kakaoAuth';
import { googleAuth } from '@/services/googleAuth';
import { queryClient } from '@/libs/api/queryClient';

const RootNavigator = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
};

export default function RootLayout() {
  const { checkAuthStatus } = useAuthStore();

  useEffect(() => {
    kakaoAuth.initialize();
    googleAuth.initialize();

    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <RootNavigator />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
