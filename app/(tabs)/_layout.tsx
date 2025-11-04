import { Redirect, Tabs } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

import HomeTabIcon from '@/components/tabs/HomeTabIcon';
import SearchTabIcon from '@/components/tabs/SearchTabIcon';
import DropTabIcon from '@/components/tabs/DropTabIcon';
import ProfileTabIcon from '@/components/tabs/ProfileTabIcon';
import DropTabButton from '@/components/tabs/DropTabButton';
import { StyleSheet } from 'react-native';

const TabsLayout = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Tabs screenOptions={{ headerShown: false, tabBarShowLabel: false, tabBarStyle: styles.tabBarStyle }}>
      <Tabs.Screen
        name="box"
        options={{
          title: 'box',
          tabBarIcon: ({ focused }) => <HomeTabIcon focused={focused} />,
          tabBarIconStyle: styles.tabBarIconStyle,
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => <SearchTabIcon focused={focused} />,
          tabBarIconStyle: styles.tabBarIconStyle,
        }}
      />

      <Tabs.Screen
        name="drop"
        options={{
          title: 'drop',
          tabBarIcon: ({ focused }) => <DropTabIcon focused={focused} />,
          tabBarButton: (props) => <DropTabButton {...props} />,
          tabBarIconStyle: styles.tabBarIconStyle,
        }}
      />

      <Tabs.Screen
        name="my"
        options={{
          title: 'my',
          tabBarIcon: ({ focused }) => <ProfileTabIcon focused={focused} />,
          tabBarIconStyle: styles.tabBarIconStyle,
        }}
      />

      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBarIconStyle: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  tabBarStyle: {
    display: 'flex',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
  },
});

export default TabsLayout;
