import { Stack } from 'expo-router';

const DropScreenLayout = () => {
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
          title: 'drop',
        }}
      />
    </Stack>
  );
};

export default DropScreenLayout;
