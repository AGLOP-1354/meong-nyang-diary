/**
 * 멍냥일기 Card Component
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../theme';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  padding?: number;
}

export const Card: React.FC<CardProps> = ({ children, style, padding }) => {
  const { theme } = useTheme();

  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.radius.lg,
    padding: padding !== undefined ? padding : theme.spacing[4],
    ...theme.shadows.md,
    ...style,
  };

  return <View style={cardStyle}>{children}</View>;
};

interface PhotoCardProps {
  children: ReactNode;
  style?: ViewStyle;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ children, style }) => {
  const { theme } = useTheme();

  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
    ...style,
  };

  return <View style={cardStyle}>{children}</View>;
};
