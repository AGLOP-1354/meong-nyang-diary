/**
 * 멍냥일기 Modal Component
 */

import React, { ReactNode } from 'react';
import { Modal as RNModal, View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../theme';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ visible, onClose, title, children, footer }) => {
  const { theme } = useTheme();

  const overlayStyle: ViewStyle = {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const modalStyle: ViewStyle = {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.radius.xl,
    padding: theme.spacing[6],
    width: '90%',
    maxHeight: '90%',
    ...theme.shadows['2xl'],
  };

  const headerStyle: TextStyle = {
    fontSize: theme.typography.fontSize.h3,
    fontFamily: theme.typography.fontFamily.primary,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral[800],
    marginBottom: theme.spacing[4],
  };

  const footerStyle: ViewStyle = {
    flexDirection: 'row',
    gap: theme.spacing[3],
    marginTop: theme.spacing[6],
    justifyContent: 'flex-end',
  };

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={overlayStyle} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View style={modalStyle}>
            {title && <Text style={headerStyle}>{title}</Text>}
            <View>{children}</View>
            {footer && <View style={footerStyle}>{footer}</View>}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </RNModal>
  );
};
