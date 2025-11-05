/**
 * Polyfills for React Native + Expo Router
 * query-string v7.1.3 is required for expo-router compatibility
 */

// URL and URLSearchParams polyfill
// import 'react-native-url-polyfill/auto'; // Removed: React Native has built-in URL support

// Log polyfill status
if (__DEV__) {
  console.log('✅ Polyfills loaded');
}
