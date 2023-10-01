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
import { deleteKey, getKeys, setStorage } from '../../services/storage';
import { Icon } from '@rneui/themed';
import { DangerProps } from '../../components/Input/Input';
import EmptyComponent from '../../components/EmptyComponent/EmptyComponent';

type NavProps = RouteProps<'Main'>;

const Main: React.FC<NavProps> = ({ navigation }) => {
  const [keys, setKeys] = useState<string[]>([]);
  const [key, setKey] = useState('');
  const [danger, setDanger] = useState<DangerProps>({} as DangerProps);
  const ItemSeparator = useCallback(() => {
    return <View style={{ height: 14 }} />;
  }, []);

  useEffect(() => {
    const data = getKeys('keys');
    setKeys(data);
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

  const handleAddKeys = () => {
    if (keys.some((k) => k === key.toUpperCase().trim())) {
      return setDanger({
        value: true,
        message: 'Essa lista já existe!',
      });
    }

    setKey('');
    const data = [key.toUpperCase().trim(), ...keys];
    setKeys(data);
    setStorage('keys', data);
  };

  const handleDeleteKey = (keyStorage: string, selected: string) => {
    const data = deleteKey(keyStorage, selected);
    setKeys(data);
  };

  const handleAlert = (item: string) => {
    Alert.alert(
      `Lista ${item} será deletada`,
      'Tem certeza que deseja perder essa lista permanentemente?.',
      [
        {
          text: 'OK',
          onPress: () => handleDeleteKey('keys', item),
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

  const EmptyList = useCallback(() => {
    return (
      <EmptyComponent
        title="Você ainda não tem listas cadastradas"
        info="Agrupe suas tarefas de forma simples"
      />
    );
  }, []);

  return (
    <Container>
      <View style={styles.container}>
        <Header
          titlePart1="NO"
          titlePart2="TES"
          arrow={false}
          task={key}
          setTask={setKey}
          onPress={() => {
            handleAddKeys();
          }}
          placeholder="Adicione uma nova lista"
          danger={danger}
          setDanger={setDanger}
        />
        <View
          style={{
            borderBottomColor: theme.colors.gray200,
            borderBottomWidth: 2,
            marginTop: '12%',
            width: theme.screnn.w - 30,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 10,
          }}
        >
          <Text style={styles.textRow}>Minhas Listas Salvas</Text>
          <Text style={styles.numberRow}>{keys.length}</Text>
        </View>
        <FlatList
          data={keys}
          keyExtractor={(item, index) => index.toString()}
          style={{ marginTop: '8%' }}
          ListEmptyComponent={EmptyList}
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
              onPress={() => navigation.navigate('Notes', item)}
            >
              <Text numberOfLines={1} style={styles.textButtons}>
                {item}
              </Text>
              <Pressable onPress={() => handleAlert(item)}>
                {({ pressed }) => (
                  <Icon
                    name="trash"
                    type="font-awesome"
                    size={28}
                    color={pressed ? theme.colors.danger : theme.colors.white}
                  />
                )}
              </Pressable>
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
    color: theme.colors.blue,
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
