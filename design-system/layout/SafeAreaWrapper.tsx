/**
 * 멍냥일기 SafeAreaWrapper Component
 */

import React, { ReactNode } from 'react';
import { SafeAreaView, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../theme';

interface SafeAreaWrapperProps {
  children: ReactNode;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  style?: ViewStyle;
}

export const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({ children, edges, style }) => {
  const { theme } = useTheme();

  const safeAreaStyle: ViewStyle = {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    ...style,
  };

  return <SafeAreaView style={safeAreaStyle}>{children}</SafeAreaView>;
};
