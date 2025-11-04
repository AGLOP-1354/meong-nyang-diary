import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg';
import { OauthIconProps } from '@/components/types';

const AppleIcon = (props: OauthIconProps) => {
  const { style } = props;

  return (
    <Svg style={style} width="18" height="22" viewBox="0 0 18 22" fill="none">
      <G clipPath="url(#clip0_90_2803)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.55682 1.848C10.9516 0.00879999 12.892 0 12.892 0C12.892 0 13.1824 1.7292 11.792 3.3968C10.3092 5.1744 8.62842 4.884 8.62842 4.884C8.62842 4.884 8.31162 3.4848 9.55242 1.848H9.55682Z"
          fill="black"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.8088 6.094C9.526 6.094 10.8592 5.1084 12.5928 5.1084C15.5804 5.1084 16.7552 7.2336 16.7552 7.2336C16.7552 7.2336 14.4584 8.4084 14.4584 11.2596C14.4584 14.476 17.3184 15.5848 17.3184 15.5848C17.3184 15.5848 15.3164 21.2168 12.6148 21.2168C11.374 21.2168 10.4104 20.3808 9.0992 20.3808C7.788 20.3808 6.446 21.2476 5.5836 21.2476C3.1152 21.2476 0 15.906 0 11.6116C0 7.3172 2.64 5.17 5.1128 5.17C6.7232 5.17 7.9684 6.0984 8.8088 6.0984V6.094Z"
          fill="black"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_90_2803">
          <Rect width="17.3184" height="21.2432" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default AppleIcon;
