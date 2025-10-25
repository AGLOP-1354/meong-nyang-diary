import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { View, Text, StyleSheet } from 'react-native'

import { useAuthStore } from '@/stores/authStore'
import AuthScreen from '@/screens/authScreen'
import { MainScreen } from '@/screens/MainScreen'

const Stack = createNativeStackNavigator()

const COLORS = {
  white: '#ffffff',
  gray900: '#333333',
}

const SplashScreen: React.FC = () => {
  return (
    <View style={styles.splashContainer}>
      <Text style={styles.splashText}>Link Dropper</Text>
    </View>
  )
}

const AuthenticatedNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainScreen} />
    </Stack.Navigator>
  )
}

const UnauthenticatedNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthScreen} />
    </Stack.Navigator>
  )
}

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return <SplashScreen />
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AuthenticatedNavigator /> : <UnauthenticatedNavigator />}
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  splashContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    flex: 1,
    justifyContent: 'center',
  },
  splashText: {
    color: COLORS.gray900,
    fontSize: 32,
    fontWeight: 'bold',
  },
})
