import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Input, {InputProps} from '../Input/Input';
import {theme} from '../../theme/theme';

const Header: React.FC<InputProps> = ({task, setTask, onPress}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={[styles.text, styles.textBlue]}>NO</Text>
        <Text style={[styles.text, styles.textPurple]}>TES</Text>
      </View>
      <Input task={task} setTask={setTask} onPress={onPress} />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.black,
    width: '100%',
    height: theme.screnn.h * 0.21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  text: {
    color: theme.colors.white,
    fontSize: 50,
    fontWeight: '900',
  },
  textBlue: {
    color: theme.colors.blue_dark,
    textDecorationLine: 'underline',
  },
  textPurple: {
    color: theme.colors.purple_dark,
    textDecorationLine: 'underline',
  },
});
