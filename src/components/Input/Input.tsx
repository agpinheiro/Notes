import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { theme } from '../../theme/theme';
import { Icon } from '@rneui/themed';
import { NewTask } from '../../pages/NotesPage/NotesPage';
import { Priority } from '../Header/Header';

export interface DangerProps {
  value: boolean;
  message: string;
}

export interface InputProps {
  task: string;
  setTask: (value: NewTask) => void | Dispatch<SetStateAction<NewTask>>;
  onPress: () => void;
  placeholder: string;
  danger: DangerProps;
  setDanger: (
    value: DangerProps,
  ) => void | Dispatch<SetStateAction<DangerProps>>;
  priority?: Priority;
}
const Input: React.FC<InputProps> = ({
  task,
  setTask,
  onPress,
  placeholder,
  danger,
  setDanger,
  priority = 'Baixa',
}) => {
  const handleAddTask = () => {
    if (task.length < 1) {
      setDanger({
        value: true,
        message: 'Esse campo não pode estar vazio!',
      });
      return;
    }
    onPress();
  };

  const clearDanger = useCallback(() => {
    setDanger({
      value: false,
      message: '',
    });
  }, [setDanger]);

  useEffect(() => {
    if (danger.value) {
      const timeout = setTimeout(clearDanger, 4000);

      return () => clearTimeout(timeout);
    }
  }, [clearDanger, danger]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View
          style={[
            styles.containerInput,
            task.length > 0 ? styles.borderInput : null,
          ]}
        >
          <TextInput
            onChangeText={(text) => {
              if (text.length > 59) {
                setDanger({
                  value: true,
                  message: 'Quantidade maxima de caracteres atingida!',
                });
                return;
              }
              setTask({ task: text, priority: priority });
            }}
            maxLength={60}
            value={task}
            placeholderTextColor={theme.colors.gray300}
            placeholder={placeholder}
            style={styles.input}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            handleAddTask();
          }}
          style={styles.button}
        >
          <Icon
            name="pluscircleo"
            type="antdesign"
            size={24}
            color={theme.colors.white}
          />
        </TouchableOpacity>
      </View>
      {danger && <Text style={styles.containerDanger}>{danger.message}</Text>}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    width: '100%',
    position: 'absolute',
    height: theme.screnn.h * 0.06,
    bottom: (-theme.screnn.h * 0.06) / 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  containerDanger: {
    color: theme.colors.danger,
    marginLeft: 10,
    fontSize: 12,
  },
  containerInput: {
    width: '80%',
    backgroundColor: theme.colors.gray,
    borderRadius: 10,
  },
  borderInput: {
    borderWidth: 1,
    borderColor: theme.colors.purple,
  },
  input: {
    marginLeft: '3%',
    fontSize: 14,
    color: 'white',
  },
  button: {
    backgroundColor: theme.colors.blue,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: theme.screnn.h * 0.06,
    height: theme.screnn.h * 0.06,
  },
});
