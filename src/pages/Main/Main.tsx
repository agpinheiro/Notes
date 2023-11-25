import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  FlatList,
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
  addListReducer,
  addTaskReducer,
  editListReducer,
  removeListReducer,
} from '../../services/store/ITaskList/reducer';

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
  const [selectedList, setSelectedList] = useState(true);
  const [danger, setDanger] = useState<DangerProps>({} as DangerProps);
  const dispatch = useDispatch();

  const ItemSeparator = useCallback(() => {
    return <View style={{ height: 14 }} />;
  }, []);

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

  const handleAddKeys = (item: string) => {
    if (
      keys.some(
        (k) =>
          k.list.key.toLocaleLowerCase().trim() ===
          item.toLocaleLowerCase().trim(),
      )
    ) {
      return setDanger({
        value: true,
        message: 'Essa lista já existe!',
      });
    }

    const newKey: IList = {
      id: generateUUID(),
      list: {
        id: generateUUID(),
        key: item,
        shared: false,
        owner: 'string',
        updated_at: new Date().toISOString(),
      },
      tasks: [],
    };

    setKeys([newKey, ...keys]);
    dispatch(addListReducer(newKey));
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
            if (!selectedList) {
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
      ...item,
      list: {
        ...item.list,
        shared: true,
      },
    };
    const filter = keys.filter((k) => k.id !== item.id);
    setKeys(filter);
    setSharedKeys([newItem, ...sharedKeys]);
    dispatch(editListReducer(newItem));
    socket.emit('sharedList', newItem.id);
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
            onPress={() => setSelectedList(true)}
            style={{ flexDirection: 'row' }}
          >
            <Text
              style={[
                styles.textRow,
                {
                  color: selectedList
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
            onPress={() => setSelectedList(false)}
            style={{ flexDirection: 'row' }}
          >
            <Text
              style={[
                styles.textRow,
                {
                  color: selectedList
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
          data={selectedList ? keys : sharedKeys}
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
              <Text numberOfLines={1} style={styles.textButtons}>
                {item.list.key}
              </Text>
              <View style={{ height: '100%', justifyContent: 'space-between' }}>
                <Pressable
                  onPress={() =>
                    selectedList ? handleAddSharedList(item) : {}
                  }
                >
                  {({ pressed }) => (
                    <Icon
                      name={selectedList ? 'share' : 'sync'}
                      type="materialicon"
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
