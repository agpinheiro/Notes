import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  ListRenderItem,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Container from '../../components/Cotainer/Container';
import { RouteProps } from '../../routes/Routes';
import { theme } from '../../theme/theme';
import EmptyComponent from '../../components/EmptyComponent/EmptyComponent';
import { FlatList } from 'react-native-gesture-handler';
import InputDescription from './components/InputDescription/InputDescription';
import { generateUUID } from '../../utils/generateId';
import { useDispatch } from 'react-redux';
import Header from '../../components/Header/Header';
import { DangerProps } from '../../components/Input/Input';
import { NewTask } from '../NotesPage/NotesPage';
import {
  Description,
  IList,
  Task,
  editDescriptionReducer,
  editListReducer,
  removeDescriptionReducer,
} from '../../services/store/ITaskList/reducer';
import { useAppSelector } from '../../hooks/redux';
import { handleEmmitterAndUpdatedListsShared } from '../../services/socket/handleEmmitter';
import socket from '../../services/socket/socket';

type NavProps = RouteProps<'Description'>;

const DescriptionPage: React.FC<NavProps> = ({ route, navigation }) => {
  const TaskRoute = route.params?.item;
  const Lists = useAppSelector((state) => state.ITaskList);
  const selectList = Lists.find((l) => l.list.id === TaskRoute?.listId);
  const selectTask = selectList?.tasks.find((t) => t.id === TaskRoute?.id);
  const [description, setDescription] = useState<Description[]>(
    selectTask?.description || [],
  );

  const [titleInput, setTitleInput] = useState<NewTask>({
    task: '',
    priority: 'Baixa',
  } as NewTask);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!TaskRoute) {
      navigation.navigate('Notes');
    }

    socket.on('updatedList', (data: IList) => {
      const newData = data.tasks.find((l) => l.id === Task?.id);
      setDescription([...newData?.description!]);
      dispatch(editListReducer(data));
    });
    return () => {
      setDescription([]);
    };
  }, []);

  const handleDataEmitter = (data: Task) => {
    const newTasks = [
      ...selectList?.tasks.filter((t) => t.id !== data.id)!,
      data,
    ];
    const emitter = {
      id: selectList?.id!,
      list: {
        ...selectList?.list!,
        updated_at: new Date().toISOString(),
      },
      tasks: newTasks,
    };
    handleEmmitterAndUpdatedListsShared(emitter);
  };

  const handleUpateDateTask = (item: Description) => {
    const filter = description.filter((desc) => desc.id !== item.id);
    filter.unshift(item);
    setDescription(filter);
    dispatch(editDescriptionReducer(item));
    const newTask: Task = {
      ...TaskRoute!,
      description: [...filter],
    };

    handleDataEmitter(newTask);
  };

  const handleColorBoder = useCallback(
    (priority: 'Alta' | 'Media' | 'Baixa' = 'Baixa') => {
      if (priority === 'Alta') {
        return theme.colors.danger;
      }
      if (priority === 'Media') {
        return theme.colors.purple_dark;
      }
      return theme.colors.blue;
    },
    [],
  );

  const itemSeparator = useCallback(() => {
    return <View style={{ height: 14 }} />;
  }, []);

  const color = handleColorBoder(selectTask?.priority);

  const handleAddDescription = () => {
    const newDescription: Description = {
      id: generateUUID(),
      type: 'input',
      taskId: TaskRoute?.id!,
      listId: TaskRoute?.listId!,
      details: '',
      title: titleInput.task,
    };
    setDescription([...description, newDescription]);
    setTitleInput({
      task: '',
      priority: 'Baixa',
    } as NewTask);
  };

  const emptyList = useCallback(() => {
    return (
      <TouchableOpacity
        onPress={handleAddDescription}
        style={{ marginTop: '20%' }}
      >
        <EmptyComponent
          title="Você ainda não informações adicionais"
          info="Clique aqui e adicione uma descrição!"
        />
      </TouchableOpacity>
    );
  }, []);

  const renderItem: ListRenderItem<Description> = ({ item, index }) => {
    return (
      <InputDescription
        color={
          index % 2 === 0 ? theme.colors.blue_dark : theme.colors.purple_dark
        }
        description={item}
        onLongPress={() => handleAlert(item)}
        onSave={(desc: Description) => {
          handleUpateDateTask(desc);
        }}
      />
    );
  };

  const handleAlert = (item: Description) => {
    Alert.alert(
      'Deletar descrição?',
      'Tem certeza que deseja apagar essa descrição pemanentemente?.',
      [
        {
          text: 'OK',
          onPress: () => {
            const filter = description.filter((desc) => desc.id !== item.id);

            dispatch(removeDescriptionReducer(item));
            setDescription(filter);
            const newTask: Task = {
              ...TaskRoute!,
              description: [...filter],
            };
            handleDataEmitter(newTask);
          },
        },
        {
          text: 'Cancelar',
          onPress: () => console.log('Cancelar Pressionado'),
          style: 'cancel', // Define o estilo do botão como "Cancelar"
        },
      ],
      { cancelable: true },
    );
  };

  const [danger, setDanger] = useState<DangerProps>({} as DangerProps);

  return (
    <Container style={{ borderWidth: 1, borderColor: color }}>
      <Header
        titlePart1="NO"
        titlePart2="TES"
        route="Notes"
        task={titleInput.task}
        setTask={setTitleInput}
        onPress={handleAddDescription}
        placeholder="Adcione informações à nota"
        danger={danger}
        setDanger={setDanger}
        navigation={navigation}
      />
      <Text
        style={{
          fontWeight: '800',
          fontSize: 18,
          color: color,
          width: '100%',
          marginHorizontal: '4%',
          marginTop: '10%',
        }}
      >
        Nota: {TaskRoute?.task}
      </Text>
      <FlatList
        data={description}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={emptyList}
        style={{ marginTop: '2%' }}
        renderItem={renderItem}
        ItemSeparatorComponent={itemSeparator}
        contentContainerStyle={{ paddingBottom: 150 }}
      />
    </Container>
  );
};

export default DescriptionPage;
