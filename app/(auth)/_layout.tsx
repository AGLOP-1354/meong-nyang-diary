import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();

  // 로딩 중에는 null 반환 (깜빡임 방지)
  if (isLoading) {
    return null;
  }

  // 이미 로그인된 경우 메인 화면으로 리다이렉트
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
