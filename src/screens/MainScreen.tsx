import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useAuthStore } from '@/stores/authStore'

export const MainScreen: React.FC = () => {
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>메인 페이지</Text>
        <Text style={styles.subtitle}>환영합니다, {user?.name || '사용자'}님!</Text>

        <View style={styles.userInfo}>
          <Text style={styles.label}>이메일:</Text>
          <Text style={styles.value}>{user?.email}</Text>

          <Text style={styles.label}>UUID:</Text>
          <Text style={styles.value}>{user?.uuid}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>로그아웃</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  label: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: '#ff4444',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    color: '#666666',
    fontSize: 18,
    marginBottom: 32,
    textAlign: 'center',
  },
  title: {
    color: '#333333',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  userInfo: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 5,
    marginBottom: 32,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  value: {
    color: '#666666',
    fontSize: 16,
    marginBottom: 16,
  },
})
