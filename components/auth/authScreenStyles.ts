import { StyleSheet } from 'react-native';

import { type Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    appleButton: {
      backgroundColor: theme.surfaceDefault,
      borderColor: theme.borderDefault,
      borderWidth: 1,
    },
    buttons: {
      gap: 12,
      marginTop: 24,
      width: '100%',
    },
    closeButton: {
      alignItems: 'center',
      height: 24,
      justifyContent: 'center',
      position: 'absolute',
      right: 16,
      width: 24,
    },
    container: {
      backgroundColor: theme.surfaceDefault,
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    googleButton: {
      backgroundColor: '#eee',
      borderColor: theme.borderDefault,
      borderWidth: 1,
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      height: 52,
      justifyContent: 'flex-start',
      paddingHorizontal: 16,
      position: 'relative',
      width: '100%',
    },
    headerTitle: {
      color: theme.textColorDefault,
      fontSize: 18,
      fontWeight: '600',
    },
    iconLeft: {
      marginRight: 8,
    },
    kakaoButton: {
      backgroundColor: theme.brandKakao,
    },
    logoImage: {
      height: 52,
      marginBottom: 12,
      width: 40,
    },
    main: {
      alignItems: 'center',
      flex: 1,
      gap: 24,
      justifyContent: 'center',
    },
    socialButton: {
      alignItems: 'center',
      borderRadius: 8,
      flexDirection: 'row',
      height: 52,
      paddingHorizontal: 20,
      position: 'relative',
    },
    socialButtonDisabled: {
      opacity: 0.6,
    },
    socialButtonText: {
      color: '#222',
      flex: 1,
      fontSize: 18,
      fontWeight: '500',
      textAlign: 'center',
    },
    subtitle: {
      color: theme.textColorSecondary,
      fontSize: 18,
      fontWeight: '500',
      textAlign: 'center',
    },
    terms: {
      color: theme.textColorSecondary,
      fontSize: 12,
      marginTop: 16,
      paddingHorizontal: 8,
      textAlign: 'center',
    },
    title: {
      color: theme.textColorPrimary,
      fontSize: 32,
      fontWeight: '700',
      textAlign: 'center',
    },
    titleContainer: {
      alignItems: 'center',
      flex: 1,
      gap: 6,
      justifyContent: 'center',
      width: '100%',
    },
  });
