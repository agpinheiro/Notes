import React, { useEffect, useState } from 'react';
import Title from '../../components/Title/Title';
import List, { Task } from './components/List/List';
import {
  deleteItemStorage,
  getStorage,
  setStorage,
  updateStorageTask,
} from '../../services/storage';
import Header from '../../components/Header/Header';
import Container from '../../components/Cotainer/Container';
import { RouteProps } from '../../routes/Routes';
import { DangerProps } from '../../components/Input/Input';
import { BackHandler } from 'react-native';
import { generateUUID } from '../../utils/generateId';

type NavProps = RouteProps<'Notes'>;

const NotesPage: React.FC<NavProps> = ({ route, navigation }) => {
  const key: string = route.params?.item || '';
  const [tasks, setTasks] = useState<Task[]>([]);
  const [danger, setDanger] = useState<DangerProps>({} as DangerProps);
  const [task, setTask] = useState('');
  useEffect(() => {
    if (key === '') {
      navigation.navigate('Main');
    }
    const data = getStorage(key);
    setTasks(data);

    return () => {
      setTasks([]);
      setTask('');
    };
  }, []);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const handleAddToStorage = () => {
    const newTask: Task = {
      id: generateUUID(),
      task,
      done: false,
    };
    const data = [newTask, ...tasks];
    setTasks(data);
    setTask('');
    setStorage(key, data);
  };

  const handleDeleteItem = (id: string) => {
    const data = deleteItemStorage(key, id);
    setTasks(data);
  };

  const handleDoneNumber = (): number => {
    return tasks.filter((item) => item.done).length;
  };

  const handleUpateDoneTask = (item: Task) => {
    const data: Task[] = updateStorageTask(key, item, tasks);
    setTasks(data);
  };

  const handleReindex = (item: Task, index: number) => {
    const currentIndex = tasks.findIndex((t) => t.id === item.id);
    if (
      (currentIndex <= 0 && index === 1) ||
      (currentIndex >= tasks.length - 1 && index === -1)
    ) {
      return;
    }
    setTasks((prevTasks) => {
      const newTasks = [...prevTasks];

      const removedItem = newTasks.splice(currentIndex, 1)[0];

      newTasks.splice(currentIndex - index, 0, removedItem);

      setStorage(key, newTasks);

      return newTasks;
    });
  };

  return (
    <Container>
      <>
        <Header
          titlePart1="NO"
          titlePart2="TES"
          task={task}
          setTask={setTask}
          onPress={handleAddToStorage}
          arrow
          placeholder="Adicione uma nova tarefa"
          danger={danger}
          setDanger={setDanger}
        />
        <Title createNumber={tasks.length} doneNumber={handleDoneNumber()} />
        <List
          tasks={tasks}
          onPress={(id: string) => handleDeleteItem(id)}
          onDone={(item: Task) => handleUpateDoneTask(item)}
          onEdit={(item: Task) => {
            setTask(item.task);
            handleDeleteItem(item.id);
          }}
          onReIndex={(item: Task, value: number) => handleReindex(item, value)}
        />
      </>
    </Container>
  );
};

export default NotesPage;
