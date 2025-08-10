import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()

// 기본 네비게이터: 다른 프로젝트에서 자유롭게 교체 가능
export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* 빈 스택. 실제 화면은 각 프로젝트에서 추가 */}
        <Stack.Screen name="Placeholder" component={PlaceholderScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

function PlaceholderScreen() {
  return null
}
