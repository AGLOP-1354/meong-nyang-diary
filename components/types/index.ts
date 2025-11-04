import { StyleProp, ViewStyle } from 'react-native';

interface TabIconProps {
  focused?: boolean;
}

interface OauthIconProps {
  style?: StyleProp<ViewStyle>;
}

export type { TabIconProps, OauthIconProps };
