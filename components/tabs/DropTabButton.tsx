import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet } from 'react-native';

const DropTabButton = (props: BottomTabBarButtonProps) => {
  const { children } = props;

  return (
    <Pressable
      style={styles.button}
      onPress={() => {
        console.log('DropTabButton pressed');
      }}
    >
      {children}
    </Pressable>
  );
};

export default DropTabButton;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
});
