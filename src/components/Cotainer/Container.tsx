import React, { ReactNode } from 'react';
import { Keyboard, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';

interface Props {
  children: ReactNode;
}
const Container: React.FC<Props> = ({ children }) => {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableNativeFeedback onPress={() => Keyboard.dismiss()}>
        {children}
      </TouchableNativeFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray600,
  },
});

export default Container;
