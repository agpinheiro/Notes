import React, { Dispatch, SetStateAction, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Input, { InputProps } from '../Input/Input';
import { theme } from '../../theme/theme';
import { Icon, Overlay } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import CheckboxComponent from '../CheckboxComponent/CheckboxComponent';
import { TextInput } from 'react-native-gesture-handler';
import { userStorage } from '../../services/storage';

interface Props extends InputProps {
  titlePart1: string;
  titlePart2: string;
  arrow?: boolean;
  priorityControl?: boolean;
  setPrioritySelected?: (
    value: Priority,
  ) => void | Dispatch<SetStateAction<Priority>>;
  prioritySelected?: Priority;
  route?: 'Main' | 'Notes' | 'Description';
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
  route = 'Main',
  setDanger,
  setPrioritySelected,
  prioritySelected = 'Baixa',
}) => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.container}>
      {arrow && (
        <TouchableOpacity
          onPress={() => navigation.navigate(route)}
          style={[styles.arrow, { left: 0 }]}
        >
          <Icon
            name="arrowleft"
            type="antdesign"
            size={24}
            color={theme.colors.white}
          />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={[styles.arrow, { right: 0 }]}
      >
        <Icon
          name="user"
          type="antdesign"
          size={24}
          color={theme.colors.white}
        />
      </TouchableOpacity>
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
      <Overlay
        overlayStyle={{
          backgroundColor: theme.colors.black,
          borderRadius: 10,
          paddingVertical: 26,
        }}
        isVisible={visible}
        onBackdropPress={() => setVisible(false)}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={{
              fontWeight: '700',
              color: theme.colors.white,
            }}
          >
            Nome atual -
          </Text>
          <Text
            style={{
              fontWeight: '700',
              color: theme.colors.blue,
            }}
          >
            {` ${userStorage.getStorage('user')}`}
          </Text>
        </View>
        <TextInput
          placeholderTextColor={theme.colors.gray300}
          placeholder="Seu nome será informado no compartilhamento"
          style={{
            backgroundColor: theme.colors.gray,
            color: theme.colors.white,
            marginTop: 10,
            borderRadius: 10,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: theme.colors.purple_dark,
          }}
          onChangeText={(value: string) =>
            userStorage.setStorage('user', value)
          }
        />
      </Overlay>
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
    width: 50,
    height: 50,
  },
});
