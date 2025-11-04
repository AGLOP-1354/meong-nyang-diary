import { Stack } from 'expo-router';

const MyProfileScreenLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'my',
        }}
      />
    </Stack>
  );
};

export default MyProfileScreenLayout;
