/**
 * 멍냥일기 Container Component
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../theme';

interface ContainerProps {
  children: ReactNode;
  padding?: boolean;
  style?: ViewStyle;
}

export const Container: React.FC<ContainerProps> = ({ children, padding = true, style }) => {
  const { theme } = useTheme();

  const containerStyle: ViewStyle = {
    width: '100%',
    paddingHorizontal: padding ? theme.spacing[4] : 0,
    ...style,
  };

  return <View style={containerStyle}>{children}</View>;
};
