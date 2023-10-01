import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Input, { InputProps } from '../Input/Input';
import { theme } from '../../theme/theme';
import { Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

interface Props extends InputProps {
  titlePart1: string;
  titlePart2: string;
  arrow?: boolean;
}

const Header: React.FC<Props> = ({
  task,
  setTask,
  onPress,
  titlePart1,
  titlePart2,
  arrow = true,
  placeholder,
  danger,
  setDanger,
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={[styles.text, styles.textBlue]}>{titlePart1}</Text>
        <Text style={[styles.text, styles.textPurple]}>{titlePart2}</Text>
      </View>
      <Input
        placeholder={placeholder}
        task={task}
        setTask={setTask}
        onPress={onPress}
        danger={danger}
        setDanger={setDanger}
      />
      {arrow && (
        <TouchableOpacity
          onPress={() => navigation.navigate('Main')}
          style={styles.arrow}
        >
          <Icon
            name="arrowleft"
            type="antdesign"
            size={24}
            color={theme.colors.white}
          />
        </TouchableOpacity>
      )}
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
    fontSize: 70,
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
  arrow: {
    position: 'absolute',
    top: 15,
    left: 15,
  },
});
