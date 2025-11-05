/**
 * 멍냥일기 Grid Component
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../theme';

export type GridColumns = 2 | 3 | 4;

interface GridProps {
  children: ReactNode;
  columns?: GridColumns;
  gap?: number;
  style?: ViewStyle;
}

export const Grid: React.FC<GridProps> = ({ children, columns = 2, gap, style }) => {
  const { theme } = useTheme();

  const gridGap = gap !== undefined ? gap : theme.spacing[2];

  const gridStyle: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -gridGap / 2,
    ...style,
  };

  const childWidth = `${(100 / columns).toFixed(2)}%`;

  return (
    <View style={gridStyle}>
      {React.Children.map(children, (child) => (
        <View
          style={{
            width: childWidth,
            paddingHorizontal: gridGap / 2,
            marginBottom: gridGap,
          }}
        >
          {child}
        </View>
      ))}
    </View>
  );
};

interface PhotoGridProps {
  children: ReactNode;
  columns?: 2 | 3;
  gap?: number;
  style?: ViewStyle;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({ children, columns = 2, gap, style }) => {
  return (
    <Grid columns={columns} gap={gap} style={style}>
      {children}
    </Grid>
  );
};
