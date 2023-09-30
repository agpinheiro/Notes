import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {theme} from '../../theme/theme';

export interface InputProps {
  task: string;
  setTask: (text: string) => void | Dispatch<SetStateAction<string>>;
  onPress: () => void;
}
const Input: React.FC<InputProps> = ({task, setTask, onPress}) => {
  const [danger, setDanger] = useState(false);

  const handleAddTask = () => {
    if (task.length < 1) {
      setDanger(true);
      return;
    }
    onPress();
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDanger(false);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [danger]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View
          style={[
            styles.containerInput,
            task.length > 0 ? styles.borderInput : null,
          ]}>
          <TextInput
            onChangeText={setTask}
            value={task}
            placeholderTextColor={theme.colors.gray300}
            placeholder="Adicione uma nova tarefa"
            style={styles.input}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleAddTask}
          style={styles.button}>
          <Text style={styles.text}>+</Text>
        </TouchableOpacity>
      </View>
      {danger && (
        <Text style={styles.containerDanger}>
          Texto vazio não pode ser adicionado a lista!
        </Text>
      )}
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
  text: {
    color: theme.colors.white,
    fontSize: 32,
  },
});
