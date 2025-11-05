/**
 * Custom entry point for Expo Router with polyfills
 * Required for Expo SDK 53 + Hermes compatibility
 */

// Import polyfills BEFORE anything else
import './polyfills';

// Import Expo Router components
import 'expo-router/entry';
