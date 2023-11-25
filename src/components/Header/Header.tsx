import React, { Dispatch, SetStateAction } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Input, { InputProps } from '../Input/Input';
import { theme } from '../../theme/theme';
import { Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import CheckboxComponent from '../CheckboxComponent/CheckboxComponent';

interface Props extends InputProps {
  titlePart1: string;
  titlePart2: string;
  arrow?: boolean;
  priorityControl?: boolean;
  setPrioritySelected?: (
    value: Priority,
  ) => void | Dispatch<SetStateAction<Priority>>;
  prioritySelected?: Priority;
}

export type Priority = 'Baixa' | 'Media' | 'Alta';

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
  setPrioritySelected,
  prioritySelected = 'Baixa',
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
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
        priority={prioritySelected}
      />

      {setPrioritySelected && (
        <View
          style={{
            paddingHorizontal: 20,
            width: '100%',
            position: 'absolute',
            height: theme.screnn.h * 0.06,
            bottom: (-theme.screnn.h * 0.18) / 2,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <CheckboxComponent
            colors={{
              name: theme.colors.blue,
              selected: theme.colors.blue,
              unselected: theme.colors.white,
            }}
            name="Baixa"
            value={prioritySelected === 'Baixa'}
            onPress={() => setPrioritySelected('Baixa')}
          />
          <CheckboxComponent
            colors={{
              name: theme.colors.purple_dark,
              selected: theme.colors.purple_dark,
              unselected: theme.colors.white,
            }}
            name="Média"
            value={prioritySelected === 'Media'}
            onPress={() => setPrioritySelected('Media')}
          />
          <CheckboxComponent
            colors={{
              name: theme.colors.danger,
              selected: theme.colors.danger,
              unselected: theme.colors.white,
            }}
            name="Alta"
            value={prioritySelected === 'Alta'}
            onPress={() => setPrioritySelected('Alta')}
          />
        </View>
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
    top: 10,
    left: 0,
    width: 50,
    height: 50,
  },
});
