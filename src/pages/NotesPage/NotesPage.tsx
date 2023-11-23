import React, { useEffect, useState } from 'react';
import Title from '../../components/Title/Title';
import List, { Task } from './components/List/List';
import {
  deleteItemStorage,
  getStorage,
  setStorage,
  updateStorageTask,
} from '../../services/storage';
import Header, { Priority } from '../../components/Header/Header';
import Container from '../../components/Cotainer/Container';
import { RouteProps } from '../../routes/Routes';
import { DangerProps } from '../../components/Input/Input';
import { BackHandler } from 'react-native';
import { generateUUID } from '../../utils/generateId';
import ButtonFilter from '../../components/Filter/ButtonFilter';
import Filter from '../../components/Filter/Filter';
import DatePicker from 'react-native-date-picker';
import { pushLocalSchedule } from '../../services/pushNotification';
import {
  checkNotifications,
  requestNotifications,
} from 'react-native-permissions';

type NavProps = RouteProps<'Notes'>;

export type NewTask = { task: string; priority: Priority };

const NotesPage: React.FC<NavProps> = ({ route, navigation }) => {
  const key: string = route.params?.item || '';
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [danger, setDanger] = useState<DangerProps>({} as DangerProps);

  const [prioritySelected, setPrioritySelected] = useState<Priority>('Baixa');
  const [task, setTask] = useState<NewTask>({
    task: '',
    priority: prioritySelected,
  } as NewTask);
  const [activeFilter, setActiveFilter] = useState(false);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [selectedItem, setItem] = useState<Task>();

  useEffect(() => {
    if (key === '') {
      navigation.navigate('Main');
    }
    const data = getStorage(key);
    setTasks(data);
    setFilteredTasks(data);

    return () => {
      setTasks([]);
      setFilteredTasks([]);

      setTask({
        task: '',
        priority: prioritySelected,
      } as NewTask);
    };
  }, []);

  async function requestPushNotificationPermission() {
    try {
      const { status } = await checkNotifications();
      if (status !== 'granted') {
        await requestNotifications(['alert', 'badge', 'sound']);
      }
    } catch (err) {
      // console.error(err);
    }
  }

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
      task: task.task,
      priority: prioritySelected,
      done: false,
    };
    const data = [newTask, ...tasks];
    setTasks(data);
    setFilteredTasks(data);

    setTask({
      task: '',
      priority: prioritySelected,
    } as NewTask);

    setStorage(key, data);
  };

  const handleDeleteItem = (id: string) => {
    const data = deleteItemStorage(key, id);
    setTasks(data);
    setFilteredTasks(data);
  };

  const handleDoneNumber = (): number => {
    return tasks.filter((item) => item.done).length;
  };

  const handleUpateDoneTask = (item: Task) => {
    const data: Task[] = updateStorageTask(key, item, tasks);
    setTasks(data);
    setFilteredTasks(data);
  };

  const handleUpateDateTask = (item: Task, date: Date) => {
    item.date = date;
    const data: Task[] = updateStorageTask(key, item, tasks);
    setTasks(data);
    setFilteredTasks(data);
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
      setFilteredTasks(newTasks);
      return newTasks;
    });
  };

  const handleFilter = (option: Priority | '') => {
    if (!option) {
      setFilteredTasks(tasks);
      return;
    }
    const filtered = tasks.filter((item) => item.priority === option);
    setFilteredTasks(filtered);
  };

  return (
    <Container>
      <>
        <Header
          titlePart1="NO"
          titlePart2="TES"
          task={task.task}
          setTask={setTask}
          onPress={handleAddToStorage}
          arrow
          placeholder="Adicione uma nova tarefa"
          danger={danger}
          setDanger={setDanger}
          priorityControl
          setPrioritySelected={setPrioritySelected}
          prioritySelected={prioritySelected}
        />
        <Title createNumber={tasks.length} doneNumber={handleDoneNumber()} />
        <ButtonFilter
          setActiveFilter={setActiveFilter}
          activeFilter={activeFilter}
        />
        {activeFilter && (
          <Filter
            onPress={(value: Priority | '') => {
              handleFilter(value);
              setActiveFilter(!activeFilter);
            }}
          />
        )}
        <List
          tasks={filteredTasks}
          onPress={(id: string) => handleDeleteItem(id)}
          onDone={(item: Task) => handleUpateDoneTask(item)}
          onEdit={(item: Task) => {
            setTask({
              task: item.task,
              priority: item.priority ? item.priority : prioritySelected,
            });
            handleDeleteItem(item.id);
          }}
          onReIndex={(item: Task, value: number) => handleReindex(item, value)}
          open={filteredTasks !== tasks}
          onDate={(item: Task) => {
            requestPushNotificationPermission();
            setOpen(true);
            setItem(item);
          }}
        />

        <DatePicker
          modal
          open={open}
          date={date}
          locale="pt-BR"
          mode="datetime"
          title="Escolha uma data"
          is24hourSource="device"
          confirmText="Salvar"
          cancelText="Cancelar"
          onConfirm={(date) => {
            setOpen(false);
            if (selectedItem) {
              pushLocalSchedule({ message: selectedItem.task, date });
              handleUpateDateTask(selectedItem, date);
            }
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </>
    </Container>
  );
};

export default NotesPage;
