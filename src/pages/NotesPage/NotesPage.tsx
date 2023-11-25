import React, { useEffect, useState } from 'react';
import Title from '../../components/Title/Title';
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
import PushNotification from 'react-native-push-notification';
import { useDispatch } from 'react-redux';
import socket from '../../services/socket/socket';
import ListComponent from './components/List/List';
import {
  IList,
  Task,
  addTaskReducer,
  editIndexTaskReducer,
  editTaskReducer,
  removeTasksReducer,
} from '../../services/store/ITaskList/reducer';
import { useAppSelector } from '../../hooks/redux';
import { userStorage } from '../../services/storage';

type NavProps = RouteProps<'Notes'>;

export type NewTask = { task: string; priority: Priority };

const NotesPage: React.FC<NavProps> = ({ route, navigation }) => {
  const Lists = route.params?.item || ({} as IList);
  const ListsReducer = useAppSelector((state) => state.ITaskList);
  console.log(ListsReducer);
  const FilterLists = ListsReducer.find((list) => list.id === Lists.id);
  const [key, setKey] = useState<IList>(Lists);
  const [tasks, setTasks] = useState<Task[]>(FilterLists?.tasks || []);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(
    FilterLists?.tasks || [],
  );
  const [danger, setDanger] = useState<DangerProps>({} as DangerProps);
  const [prioritySelected, setPrioritySelected] = useState<Priority>('Baixa');
  const [task, setTask] = useState<NewTask>({
    task: '',
    priority: prioritySelected,
  } as NewTask);
  const [activeFilter, setActiveFilter] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [selectedItem, setItem] = useState<Task>();
  const dispatch = useDispatch();
  useEffect(() => {
    if (key.id === '') {
      navigation.navigate('Main');
    }
    const backAction = () => {
      navigation.goBack();
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => {
      backHandler.remove();
      setTasks([]);
      setFilteredTasks([]);
      setKey({} as IList);
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

  const handleAddToStorage = () => {
    const newTask: Task = {
      id: generateUUID(),
      task: task.task,
      listId: key.list.id,
      priority: prioritySelected,
      description: [],
      done: false,
      user: userStorage.getStorage('user'),
      schedule: false,
      deleted: false,
    };
    const data = [newTask, ...tasks];
    setTasks(data);
    setFilteredTasks(data);
    dispatch(addTaskReducer(newTask));
    setTask({
      task: '',
      priority: prioritySelected,
    } as NewTask);
    if (key.list.shared) {
      socket.emit('updatedList', data);
    }
  };

  const handleDeleteItem = (item: Task) => {
    const newData = tasks.filter((t) => t.id !== item.id);
    setTasks(newData);
    setFilteredTasks(newData);
    dispatch(removeTasksReducer(item));
    if (key.list.shared) {
      socket.emit('deletedList', newData);
    }
  };

  const handleDoneNumber = (): number => {
    return tasks.filter((item) => item.done).length;
  };

  const handleUpateDoneTask = (item: Task) => {
    PushNotification.getScheduledLocalNotifications((notifys) => {
      const deleteNotify = notifys.find((notify) => notify.id === item.id);
      if (deleteNotify) {
        PushNotification.cancelLocalNotification(deleteNotify.id);
      }
    });
    const newTask = {
      ...item,
      schedule: false,
      done: !item.done,
      updated_at: new Date().toISOString(),
      user: userStorage.getStorage('user'),
    };
    const newData = tasks.filter((t) => t.id !== item.id);
    newData.push(newTask);
    setTasks(newData);
    setFilteredTasks(newData);
    dispatch(editTaskReducer(item));
    if (key.list.shared) {
      socket.emit('updatedList', newData);
    }
  };

  const handleUpateDateTask = (item: Task, date: Date) => {
    const updateTask: Task = {
      ...item,
      date: date,
      schedule: item.done ? false : true,
      user: userStorage.getStorage('user'),
    };
    const newData = tasks.filter((t) => t.id !== item.id);
    newData.unshift(updateTask);
    setTasks(newData);
    setFilteredTasks(newData);
    if (key.list.shared) {
      socket.emit('updatedList', newData);
    }
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

      dispatch(editIndexTaskReducer(newTasks));
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
        <ListComponent
          tasks={filteredTasks}
          onPress={(item: Task) => handleDeleteItem(item)}
          onDone={(item: Task) => handleUpateDoneTask(item)}
          onEdit={(item: Task) => {
            setTask({
              task: item.task,
              priority: item.priority ? item.priority : prioritySelected,
            });
            handleDeleteItem(item);
          }}
          onReIndex={(item: Task, value: number) => handleReindex(item, value)}
          open={filteredTasks !== tasks}
          onDate={(item: Task) => {
            requestPushNotificationPermission();
            setOpenDate(true);
            setItem(item);
          }}
        />

        <DatePicker
          modal
          open={openDate}
          date={new Date()}
          minimumDate={new Date()}
          locale="pt-BR"
          mode="datetime"
          title="Escolha uma data"
          is24hourSource="device"
          confirmText="Salvar"
          cancelText="Cancelar"
          onConfirm={(newDate) => {
            setOpenDate(false);
            if (selectedItem) {
              if (!selectedItem.done) {
                pushLocalSchedule({
                  item: selectedItem,
                  key: key.list.key,
                  date: newDate,
                });
              }
              handleUpateDateTask(selectedItem, newDate);
            }
          }}
          onCancel={() => {
            setOpenDate(false);
          }}
        />
      </>
    </Container>
  );
};

export default NotesPage;
