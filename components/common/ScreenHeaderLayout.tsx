import { View, StyleSheet } from 'react-native';

interface ScreenHeaderLayoutProps {
  children: React.ReactNode;
}

const ScreenHeaderLayout = (props: ScreenHeaderLayoutProps) => {
  const { children } = props;

  return <View style={styles.container}>{children}</View>;
};

export default ScreenHeaderLayout;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
});
