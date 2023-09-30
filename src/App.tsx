import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {theme} from './theme/theme';
import Header from './components/Header/Header';
import Title from './components/Title/Title';
import List, {Task} from './components/List/List';
import {
  deleteItemStorage,
  getStorage,
  setStorage,
  updateStorageTask,
} from './services/storage';

function App(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState('');
  useEffect(() => {
    const data = getStorage('tasks');
    setTasks(data);
  }, []);

  const handleAddToStorage = () => {
    const newTask: Task = {
      id: tasks.length.toString(),
      task,
      done: false,
    };
    const data = [newTask, ...tasks]
    setTasks(data);
    setTask('');
    setStorage('tasks', data);
  };

  const handleDeleteItem = (id: string) => {
    const data = deleteItemStorage('tasks', id);
    setTasks(data);
  };

  const handleDoneNumber = (): number => {
    return tasks.filter(item => item.done).length;
  };

  const handleUpateDoneTask = (item: Task) => {
    const data: Task[] = updateStorageTask('tasks', item, tasks);
    setTasks(data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={theme.colors.black} />
      <Header task={task} setTask={setTask} onPress={handleAddToStorage} />
      <Title createNumber={tasks.length} doneNumber={handleDoneNumber()} />
      <List
        tasks={tasks}
        onPress={(id: string) => handleDeleteItem(id)}
        onDone={(item: Task) => handleUpateDoneTask(item)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray600,
  },
});

export default App;
