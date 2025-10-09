import { ColorSchemeName } from 'react-native'

export type Theme = {
  // Surface
  surfaceDefault: string
  surfaceDefault2: string
  surfacePrimary0: string
  surfacePrimary1: string
  surfacePrimary2: string
  surfacePrimary3: string
  surfacePrimary4: string
  surfacePrimary: string
  surfaceLink1: string
  surfaceLink3: string
  surfaceDesignComplete: string

  // Border
  borderDefault: string
  borderSecondary: string
  borderPrimary: string
  borderPrimaryDrag: string
  dropActivateFolderBorder: string
  dropActivateFolderBackground: string

  // Icon
  iconColorDefault: string
  iconColorSecondary: string
  iconColorTertiary: string
  iconColorPrimary: string
  iconColorPrimarySecondary: string
  iconColorPrimaryOpacity: string
  iconColorWhite: string
  iconColorInvert: string
  iconColorError: string

  // Text
  textColorDefault: string
  textColorSecondary: string
  textColorTertiary: string
  textColorPrimary: string
  textColorPrimarySecondary: string
  textColorWhite: string
  textColorInvert: string
  textColorError: string
  textColorDrag: string

  // Button
  buttonDefaultSurface: string
  buttonDefaultSurfaceAction: string
  buttonPrimarySurface: string
  buttonInvertSurface: string
  buttonDisabledSurface: string
  buttonErrorSurface: string
  buttonSurfaceActionDimmed: string
  buttonDefaultActionSurface: string

  // Input
  inputDefaultBorder: string
  inputActionBorder: string
  inputError: string
  inputDefaultSurface: string
  inputDisabledSurface: string

  // Shadow / Overlay
  dropdownShadow: string
  modalShadow: string
  overlayDimmed: string

  // Avatars (semantic palette)
  avatarsRed: string
  avatarsYellow: string
  avatarsGreen: string
  avatarsCyan: string
  avatarsBlue: string
  avatarsGrape: string
  avatarsPink: string

  // Brand colors
  brandKakao: string
  brandAppleBlack: string
}

export const lightTheme: Theme = {
  // Surface
  surfaceDefault: '#ffffff',
  surfaceDefault2: '#f2f2f2',
  surfacePrimary0: '#0000ee0a',
  surfacePrimary1: '#0000ee14',
  surfacePrimary2: '#0000ee29',
  surfacePrimary3: '#0000ee4d',
  surfacePrimary4: '#0000ee80',
  surfacePrimary: '#0000ee',
  surfaceLink1: '#ebebfe',
  surfaceLink3: '#b2b2fa',
  surfaceDesignComplete: '#d3f9d8',

  // Border
  borderDefault: '#eeeeee',
  borderSecondary: '#222222',
  borderPrimary: '#0000ee14',
  borderPrimaryDrag: '#0000ee4d',
  dropActivateFolderBorder: '#0000ee4d',
  dropActivateFolderBackground: '#0000ff0a',

  // Icon
  iconColorDefault: '#222222',
  iconColorSecondary: '#666666',
  iconColorTertiary: '#aaaaaa',
  iconColorPrimary: '#0000ee',
  iconColorPrimarySecondary: '#b2b2fa',
  iconColorPrimaryOpacity: '#0000ee0a',
  iconColorWhite: '#ffffff',
  iconColorInvert: '#ffffff',
  iconColorError: '#fa5252',

  // Text
  textColorDefault: '#222222',
  textColorSecondary: '#666666',
  textColorTertiary: '#aaaaaa',
  textColorPrimary: '#0000ee',
  textColorPrimarySecondary: '#b2b2fa',
  textColorWhite: '#ffffff',
  textColorInvert: '#ffffff',
  textColorError: '#fa5252',
  textColorDrag: '#a5d8ff',

  // Button
  buttonDefaultSurface: '#ffffff',
  buttonDefaultSurfaceAction: '#0000ee0a',
  buttonPrimarySurface: '#0000ee',
  buttonInvertSurface: '#222222',
  buttonDisabledSurface: '#f2f2f2',
  buttonErrorSurface: '#fa5252',
  buttonSurfaceActionDimmed: '#0000001f',
  buttonDefaultActionSurface: '#0000ee0a',

  // Input
  inputDefaultBorder: '#eeeeee',
  inputActionBorder: '#0000ee',
  inputError: '#fa5252',
  inputDefaultSurface: '#ffffff',
  inputDisabledSurface: '#f2f2f2',

  // Shadow / Overlay
  dropdownShadow: '#0000003d',
  modalShadow: '#0000001f',
  overlayDimmed: '#ffffff80',

  // Avatars
  avatarsRed: '#c75f5f',
  avatarsYellow: '#e5ab67',
  avatarsGreen: '#62a471',
  avatarsCyan: '#68afb3',
  avatarsBlue: '#6886b3',
  avatarsGrape: '#9e7ec6',
  avatarsPink: '#cc8cba',

  // Brand
  brandKakao: '#FEE500',
  brandAppleBlack: '#000000',
}

export const darkTheme: Theme = {
  // Surface
  surfaceDefault: '#222222',
  surfaceDefault2: 'rgba(255, 255, 255, 0.08)',
  surfacePrimary0: '#ffffff14',
  surfacePrimary1: '#ffffff29',
  surfacePrimary2: '#ffffff4d',
  surfacePrimary3: '#ffffff80',
  surfacePrimary4: '#ffffffb3',
  surfacePrimary: '#ffffff',
  surfaceLink1: '#ebebfe',
  surfaceLink3: '#b2b2fa',
  surfaceDesignComplete: '#d3f9d8',

  // Border
  borderDefault: '#ffffff29',
  borderSecondary: '#ffffff',
  borderPrimary: '#ffffff14',
  borderPrimaryDrag: '#ffffff4d',
  dropActivateFolderBorder: '#ffffff80',
  dropActivateFolderBackground: '#ffffff14',

  // Icon
  iconColorDefault: '#ffffff',
  iconColorSecondary: '#ffffffb3',
  iconColorTertiary: '#ffffff80',
  iconColorPrimary: '#ffffff',
  iconColorPrimarySecondary: '#b2b2fa',
  iconColorPrimaryOpacity: '#ffffff0a',
  iconColorWhite: '#ffffff',
  iconColorInvert: '#ffffff',
  iconColorError: '#fa5252',

  // Text
  textColorDefault: '#ffffff',
  textColorSecondary: '#ffffffb3',
  textColorTertiary: '#ffffff80',
  textColorPrimary: '#ffffff',
  textColorPrimarySecondary: '#b2b2fa',
  textColorWhite: '#ffffff',
  textColorInvert: '#222222',
  textColorError: '#fa5252',
  textColorDrag: '#a5d8ff',

  // Button
  buttonDefaultSurface: '#222222',
  buttonDefaultSurfaceAction: '#ffffff0a',
  buttonPrimarySurface: '#0000ee',
  buttonInvertSurface: '#ffffff',
  buttonDisabledSurface: '#ffffff14',
  buttonErrorSurface: '#fa5252',
  buttonSurfaceActionDimmed: '#0000001f',
  buttonDefaultActionSurface: '#ffffff14',

  // Input
  inputDefaultBorder: '#ffffff29',
  inputActionBorder: '#ffffff',
  inputError: '#fa5252',
  inputDefaultSurface: '#222222',
  inputDisabledSurface: '#ffffff14',

  // Shadow / Overlay
  dropdownShadow: '#0000003d',
  modalShadow: '#0000001f',
  overlayDimmed: '#11111c99',

  // Avatars
  avatarsRed: '#c75f5f',
  avatarsYellow: '#e5ab67',
  avatarsGreen: '#62a471',
  avatarsCyan: '#68afb3',
  avatarsBlue: '#6886b3',
  avatarsGrape: '#9e7ec6',
  avatarsPink: '#cc8cba',

  // Brand
  brandKakao: '#FEE500',
  brandAppleBlack: '#000000',
}

export const getThemeByScheme = (scheme: ColorSchemeName): Theme => (scheme === 'dark' ? darkTheme : lightTheme)
