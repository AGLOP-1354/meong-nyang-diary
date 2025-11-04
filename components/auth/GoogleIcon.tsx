import Svg, { Path, G, Mask } from 'react-native-svg';
import { OauthIconProps } from '@/components/types';

const GoogleIcon = (props: OauthIconProps) => {
  const { style } = props;

  return (
    <Svg style={style} width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Mask id="mask0_90_2553" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
        <Path d="M20 0H0V20H20V0Z" fill="white" />
      </Mask>
      <G mask="url(#mask0_90_2553)">
        <Path
          d="M19.6 10.22C19.6 9.50998 19.54 8.82998 19.42 8.16998H10V12.04H15.38C15.15 13.29 14.44 14.35 13.38 15.06V17.57H16.61C18.5 15.83 19.59 13.27 19.59 10.22H19.6Z"
          fill="#4285F4"
        />
        <Path
          d="M10 20C12.7 20 14.96 19.1 16.62 17.58L13.39 15.07C12.49 15.67 11.35 16.02 10 16.02C7.4 16.02 5.18999 14.26 4.39999 11.9H1.06V14.49C2.71 17.76 6.09 20 10 20Z"
          fill="#34A853"
        />
        <Path
          d="M4.39999 11.9C4.19999 11.3 4.09 10.66 4.09 10C4.09 9.34001 4.19999 8.70001 4.39999 8.10001V5.51001H1.06C0.379998 6.86001 0 8.39001 0 10C0 11.61 0.389998 13.14 1.06 14.49L4.39999 11.9Z"
          fill="#FBBC04"
        />
        <Path
          d="M10 3.97C11.47 3.97 12.79 4.47 13.82 5.47L16.69 2.6C14.96 0.99 12.69 0 10 0C6.09 0 2.71 2.24 1.06 5.51L4.39999 8.1C5.18999 5.74 7.39 3.98 10 3.98V3.97Z"
          fill="#E94235"
        />
      </G>
    </Svg>
  );
};

export default GoogleIcon;
