/**
 * 앱 진입점 - 인증 상태에 따라 리다이렉트
 */

import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from '@/stores/authStore';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthStore();

  // 인증 상태 확인 중에는 로딩 표시
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 인증 상태에 따라 리다이렉트
  return isAuthenticated ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)" />;
}
