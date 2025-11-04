import { Stack } from 'expo-router';

const SearchScreenLayout = () => {
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
          title: 'Search',
        }}
      />
    </Stack>
  );
};

export default SearchScreenLayout;
