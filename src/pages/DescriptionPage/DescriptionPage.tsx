import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Container from '../../components/Cotainer/Container';
import { RouteProps } from '../../routes/Routes';
import { theme } from '../../theme/theme';
import { Icon } from '@rneui/themed';
import EmptyComponent from '../../components/EmptyComponent/EmptyComponent';
import { FlatList } from 'react-native-gesture-handler';
import InputDescription from './components/InputDescription/InputDescription';
import { generateUUID } from '../../utils/generateId';
import {
  Description,
  Task,
  editTask,
} from '../../services/store/Tasks/reducer';
import { useAppSelector } from '../../hooks/redux';
import { useDispatch } from 'react-redux';
import { editDescription } from '../../services/store/Desriptions/reducer';

type NavProps = RouteProps<'Description'>;

const DescriptionPage: React.FC<NavProps> = ({ route, navigation }) => {
  const Descriptions = useAppSelector((state) => state.Description);
  const [description, setDescription] = useState<Description[]>([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!route.params?.task) {
      navigation.navigate('Notes');
    } else {
      setDescription(
        Descriptions.filter((desc) => desc.taskId === route.params?.task.id),
      );
    }
    return () => {
      setDescription([]);
    };
  }, []);

  const handleUpateDateTask = (item: Description) => {
    const filter = description.filter((desc) => desc.id !== item.id);

    filter.unshift(item);
    setDescription(filter);
    dispatch(editDescription(item));
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

  const color = handleColorBoder(route.params?.task.priority);

  const handleAddDescription = () => {
    setDescription([
      ...description,
      {
        id: generateUUID(),
        type: 'input',
        taskId: route.params?.task.id!,
        details: 'Clique aqui para editar',
        title: 'Titulo',
      },
    ]);
  };

  const emptyList = useCallback(() => {
    return (
      <TouchableOpacity
        onPress={handleAddDescription}
        style={{ marginTop: '30%' }}
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
        onSave={(desc: Description) => handleUpateDateTask(desc)}
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

            dispatch(editDescription(item));
            setDescription(filter);
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

  return (
    <Container style={{ borderWidth: 1, borderColor: color }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Notes')}
        style={styles.arrow}
      >
        <Icon
          name="arrowleft"
          type="antdesign"
          size={24}
          color={theme.colors.white}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleAddDescription}
        style={[
          styles.container,
          { backgroundColor: color, marginBottom: '5%' },
        ]}
      >
        <View style={[styles.row]}>
          <Text style={[styles.text, { fontSize: 18 }]}>
            {route.params?.task.task}
          </Text>
        </View>
      </TouchableOpacity>

      <View
        style={[
          styles.row,
          {
            justifyContent: 'space-between',
            width: '80%',
            alignSelf: 'center',
            paddingBottom: 10,
          },
        ]}
      />
      <FlatList
        data={description}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={emptyList}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </Container>
  );
};

export default DescriptionPage;

const styles = StyleSheet.create({
  container: {
    width: '80%',
    alignSelf: 'center',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  text: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  arrow: {
    width: '100%',
    paddingTop: 15,
    alignItems: 'flex-start',
    paddingLeft: 15,
    paddingVertical: 10,
  },
  containerInput: {
    width: theme.screnn.w * 0.9,
    marginTop: 4,
    borderRadius: 10,
    alignSelf: 'center',
  },
  input: {
    marginLeft: '3%',
    fontSize: 14,
    color: 'white',
    width: theme.screnn.w * 0.84,
  },
});
