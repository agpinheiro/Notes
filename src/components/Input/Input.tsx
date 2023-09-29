import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {theme} from '../../theme/theme';

// import { Container } from './styles';

const Input: React.FC = () => {
  const [task, setTask] = useState('');
  return (
    <View style={styles.container}>
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
      <TouchableOpacity style={styles.button}>
        <Text style={styles.text}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    width: '100%',
    flexDirection: 'row',
    position: 'absolute',
    height: theme.screnn.h * 0.06,
    bottom: (-theme.screnn.h * 0.06) / 2,
    justifyContent: 'space-around',
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
    fontSize: 28,
  },
});
