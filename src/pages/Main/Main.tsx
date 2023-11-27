import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  AppState,
  AppStateStatus,
  BackHandler,
  FlatList,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Container from '../../components/Cotainer/Container';
import { RouteProps } from '../../routes/Routes';
import { theme } from '../../theme/theme';
import Header from '../../components/Header/Header';
import { Icon } from '@rneui/themed';
import { DangerProps } from '../../components/Input/Input';
import EmptyComponent from '../../components/EmptyComponent/EmptyComponent';
import { NewTask } from '../NotesPage/NotesPage';
import { generateUUID } from '../../utils/generateId';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../hooks/redux';
import socket from '../../services/socket/socket';
import {
  IList,
  editListReducer,
  removeListReducer,
} from '../../services/store/ITaskList/reducer';
import { userStorage } from '../../services/storage';
import { handleEmmitterAndUpdatedListsShared } from '../../services/socket/handleEmmitter';
import RNShare from 'react-native-share';
import { uri, token } from '../../config/index.json';

type NavProps = RouteProps<'Main'>;

const Main: React.FC<NavProps> = ({ navigation }) => {
  const Lists = useAppSelector((state) => state.ITaskList);
  const [sharedKeys, setSharedKeys] = useState<IList[]>(
    Lists.filter((l) => l.list.shared),
  );
  const [keys, setKeys] = useState<IList[]>(
    Lists.filter((l) => !l.list.shared),
  );
  const [key, setKey] = useState<NewTask>({
    task: '',
    priority: 'Baixa',
  } as NewTask);
  const [selectedList, setSelectedList] = useState<'local' | 'share'>('local');
  const [danger, setDanger] = useState<DangerProps>({} as DangerProps);
  const [deepID, setDeepID] = useState('');
  const [activeSocket, setActiveSocket] = useState(false);
  const dispatch = useDispatch();
  const ItemSeparator = useCallback(() => {
    return <View style={{ height: 14 }} />;
  }, []);

  useEffect(() => {
    setSharedKeys(Lists.filter((l) => l.list.shared));
    setKeys(Lists.filter((l) => !l.list.shared));
  }, [Lists]);

  useEffect(() => {
    if (deepID) {
      const timeout = setTimeout(() => {
        handleAddKeys(deepID);
        setDeepID('');
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [deepID]);

  useEffect(() => {
    const handleDeepLink = ({ url }: { url: string }) => {
      const id = url.indexOf('id');
      const newList = url.substring(id + 3, url.length);
      if (newList) {
        setDeepID(newList);
        setSelectedList('share');
      }
    };

    Linking.addEventListener('url', handleDeepLink);

    if (Platform.OS === 'android') {
      Linking.getInitialURL().then((url) => {
        if (url) {
          handleDeepLink({ url });
        }
      });
    }

    return () => {
      Linking.removeAllListeners('url');
    };
  }, []);

  useEffect(() => {
    const shareRoom = Lists.filter((l) => l.list.shared);

    shareRoom.forEach((room) => {
      socket.emit('room', room.id);
    });

    socket.on('initialList', (data: IList) => {
      const findList = shareRoom.find((li) => li.id === data.id);
      if (
        findList &&
        new Date(findList.list.updated_at) < new Date(data.list.updated_at)
      ) {
        dispatch(editListReducer(data));
      }
    });
  }, [activeSocket]);

  useEffect(() => {
    const backAction = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        handleSyncSocket();
      }
    };
    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      (AppState as any).removeEventListener('change', handleAppStateChange);
    };
  }, []);

  const handleSyncSocket = async () => {
    socket.disconnect();
    try {
      await reconnectSocket();
    } catch (error) {
      console.error('Erro ao reconectar o socket:', error);
      return;
    }
  };

  const reconnectSocket = async () => {
    try {
      await socket.connect();
      socket.emit('auth', token);
      setActiveSocket(!activeSocket);
    } catch (error) {
      throw error;
    }
  };

  const handleAddKeys = (item: string) => {
    if (
      Lists.some(
        (k) =>
          k.list.key.toLocaleLowerCase().trim() ===
            item.toLocaleLowerCase().trim() ||
          k.id.toLocaleLowerCase().trim() === item.toLocaleLowerCase().trim(),
      )
    ) {
      return setDanger({
        value: true,
        message: 'Essa lista já existe!',
      });
    }
    if (
      item.length === generateUUID().length &&
      !Lists.some((k) => k.id === item)
    ) {
      if (socket.active) {
        socket.emit('room', item);

        socket.on('initialList', (data: IList) => {
          const newKey: IList = {
            id: data.id,
            list: data.list,
            tasks: data.tasks,
          };

          setSharedKeys([...sharedKeys, newKey]);
          dispatch(editListReducer(newKey));
        });
        return;
      }
      socket.connect();
      socket.emit('room', item);

      socket.on('initialList', (data: IList) => {
        const newKey: IList = {
          id: data.id,
          list: data.list,
          tasks: data.tasks,
        };

        setSharedKeys([...sharedKeys, newKey]);
        dispatch(editListReducer(newKey));
      });
      return;
    }

    const newKey: IList = {
      id: generateUUID(),
      list: {
        id: generateUUID(),
        key: item,
        shared: false,
        owner: userStorage.getStorage('user'),
        updated_at: new Date().toISOString(),
      },
      tasks: [],
    };

    setKeys([newKey, ...keys]);
    dispatch(editListReducer(newKey));
  };

  const handleDeleteKey = (item: IList) => {
    dispatch(removeListReducer(item));
    const filter = keys.filter((k) => k.id !== item.id);
    setKeys(filter);
  };

  const handleAlert = (item: IList) => {
    Alert.alert(
      `Lista ${item.list.key} será deletada`,
      'Tem certeza que deseja perder essa lista permanentemente?.',
      [
        {
          text: 'OK',
          onPress: () => {
            if (selectedList === 'share') {
              handleDeleteSharedKey(item);
            }
            handleDeleteKey(item);
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

  const emptyList = useCallback(() => {
    return (
      <EmptyComponent
        title="Você ainda não tem listas cadastradas"
        info="Agrupe suas tarefas de forma simples"
      />
    );
  }, []);

  const handleAddSharedList = (item: IList) => {
    const newItem: IList = {
      id: item.id,
      list: {
        ...item.list,
        shared: true,
        owner: userStorage.getStorage('user'),
      },
      tasks: [...item.tasks],
    };
    const filter = keys.filter((k) => k.id !== item.id);
    setKeys(filter);
    setSharedKeys([newItem, ...sharedKeys]);
    dispatch(editListReducer(newItem));
    handleEmmitterAndUpdatedListsShared(newItem);
  };

  const handleSocketShare = (item: IList) => {
    try {
      RNShare.open({
        type: 'text',
        title: item.id,
        message: `Clique no link no link para ter acesso a lista compartilhada!\n\nLista - *${item.list.key}*\n\nCriada por - *${item.list.owner}*\n\n${uri}${item.id}`,
      });
    } catch (err) {
      // error
    }
  };

  const handleDeleteSharedKey = (item: IList) => {
    const filter = sharedKeys.filter((k) => k.id !== item.id);
    setSharedKeys(filter);
    dispatch(removeListReducer(item));
  };

  return (
    <Container>
      <View style={styles.container}>
        <Header
          titlePart1="NO"
          titlePart2="TES"
          arrow={false}
          task={key.task}
          setTask={(value) => setKey(value)}
          onPress={() => {
            handleAddKeys(key.task);
            setKey({
              task: '',
              priority: 'Baixa',
            } as NewTask);
          }}
          placeholder="Adicione uma nova lista"
          danger={danger}
          setDanger={setDanger}
        />
        <View
          style={{
            borderBottomColor: theme.colors.gray200,
            borderBottomWidth: 2,
            marginTop: '8%',
            width: theme.screnn.w - 30,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => setSelectedList('local')}
            style={{ flexDirection: 'row' }}
          >
            <Text
              style={[
                styles.textRow,
                {
                  color:
                    selectedList === 'local'
                      ? theme.colors.blue_dark
                      : theme.colors.white,
                },
              ]}
            >
              Pessoais
            </Text>
            <Text style={styles.numberRow}>{keys.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedList('share')}
            style={{ flexDirection: 'row' }}
          >
            <Text
              style={[
                styles.textRow,
                {
                  color:
                    selectedList === 'local'
                      ? theme.colors.white
                      : theme.colors.purple_dark,
                },
              ]}
            >
              Compartilhadas
            </Text>
            <Text style={styles.numberRow}>{sharedKeys.length}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={selectedList === 'local' ? keys : sharedKeys}
          keyExtractor={(item, index) => index.toString()}
          style={{
            marginTop: '4%',
          }}
          ListEmptyComponent={emptyList}
          ItemSeparatorComponent={ItemSeparator}
          contentContainerStyle={{ paddingBottom: 60 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.buttons,
                {
                  backgroundColor:
                    index % 2 === 0
                      ? theme.colors.purple_dark
                      : theme.colors.blue_dark,
                },
              ]}
              onPress={() => navigation.navigate('Notes', { item: item })}
            >
              <Text
                style={{
                  color: theme.colors.white,
                  position: 'absolute',
                  top: 2,
                  left: 2,
                  marginLeft: 10,
                  fontSize: 12,
                }}
              >
                {item.list.owner}
              </Text>

              <Text numberOfLines={1} style={styles.textButtons}>
                {item.list.key}
              </Text>
              <View style={{ height: '100%', justifyContent: 'space-between' }}>
                <Pressable
                  onPress={() => {
                    if (selectedList === 'local') {
                      handleAddSharedList(item);
                      setSelectedList('share');
                    }
                    handleSocketShare(item);
                  }}
                >
                  {({ pressed }) => (
                    <Icon
                      name={selectedList === 'local' ? 'share' : 'group-add'}
                      type="materialicons"
                      size={24}
                      color={pressed ? theme.colors.danger : theme.colors.white}
                    />
                  )}
                </Pressable>
                <Pressable onPress={() => handleAlert(item)}>
                  {({ pressed }) => (
                    <Icon
                      name="trash"
                      type="font-awesome"
                      size={24}
                      color={pressed ? theme.colors.danger : theme.colors.white}
                    />
                  )}
                </Pressable>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: theme.colors.white,
  },
  header: {
    width: theme.screnn.w,
    height: theme.screnn.h * 0.1,
    backgroundColor: theme.colors.black,
  },
  buttons: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    width: theme.screnn.w - 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: theme.screnn.h * 0.1,
  },
  textButtons: {
    color: theme.colors.white,
    fontSize: 28,
    fontWeight: 'bold',
    flex: 1,
    textAlignVertical: 'center',
  },
  numberRow: {
    backgroundColor: theme.colors.gray,
    fontSize: 14,
    width: 20,
    height: 20,
    borderRadius: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginLeft: 10,
    fontWeight: '900',
    color: theme.colors.white,
  },
  textRow: {
    fontSize: 16,
    fontWeight: '900',
  },
  containerEmpty: {
    alignItems: 'center',
    marginTop: '14%',
  },
  textEmpity: {
    color: theme.colors.gray300,
    fontSize: 18,
  },
});

export default Main;
