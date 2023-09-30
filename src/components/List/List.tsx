import React, {useCallback} from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {theme} from '../../theme/theme';
import {Icon} from '@rneui/themed';

export interface Task {
  id: string;
  task: string;
  done: boolean;
}

interface Props {
  tasks: Task[];
  onPress: (id: string) => void;
  onDone: (item: Task) => void;
}

interface ColorProps {
  color: string;
  border: string;
  icon: boolean;
  colorText: string;
  decoration: 'line-through' | 'none';
}

const List: React.FC<Props> = ({tasks, onPress, onDone}) => {
  const renderItem: ListRenderItem<Task> = ({item}) => {
    const handleColor = () => {
      if (item.done) {
        const colors: ColorProps = {
          color: theme.colors.purple_dark,
          border: theme.colors.purple_dark,
          icon: true,
          colorText: theme.colors.gray200,
          decoration: 'line-through',
        };
        return colors;
      }
      const colors: ColorProps = {
        color: theme.colors.gray,
        border: theme.colors.blue_dark,
        icon: false,
        colorText: theme.colors.white,
        decoration: 'none',
      };
      return colors;
    };
    const color: ColorProps = handleColor();
    return (
      <View style={styles.item}>
        <TouchableOpacity
          onPress={() => onDone(item)}
          style={[
            styles.check,
            {backgroundColor: color.color, borderColor: color.border},
          ]}>
          {color.icon && (
            <Icon
              name="check"
              type="feather"
              size={20}
              color={theme.colors.white}
            />
          )}
        </TouchableOpacity>

        <Text
          numberOfLines={2}
          style={[
            styles.text,
            {color: color.colorText, textDecorationLine: color.decoration},
          ]}>
          {item.task}
        </Text>
        <Pressable onPress={() => onPress(item.id)}>
          {({pressed}) => (
            <Icon
              name="trash"
              type="font-awesome"
              size={30}
              color={pressed ? theme.colors.danger : theme.colors.white}
            />
          )}
        </Pressable>
      </View>
    );
  };
  const ItemSeparator = useCallback(() => {
    return <View style={{height: 14}} />;
  }, []);
  const EmptyItem = useCallback(() => {
    return (
      <View style={styles.containerEmpty}>
        <Image
          style={styles.img}
          source={require('../../assets/clipboard.png')}
        />
        <Text style={[styles.textEmpity, {fontWeight: '700'}]}>
          Você ainda não tem tarefas cadastradas
        </Text>
        <Text style={[styles.textEmpity, {fontWeight: '300'}]}>
          Crie tarefas e organize seus itens a fazer
        </Text>
      </View>
    );
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        style={{width: '100%'}}
        ListEmptyComponent={EmptyItem}
        contentContainerStyle={{paddingBottom: 60}}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '8%',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  item: {
    backgroundColor: theme.colors.gray,
    width: '100%',
    flexDirection: 'row',
    height: theme.screnn.h * 0.08,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.3,
    borderColor: theme.colors.white,
  },
  text: {
    fontSize: 16,
    width: '78%',
    textAlign: 'left',
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 15,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ok: {
    color: theme.colors.white,
    fontSize: 9,
    fontWeight: 'bold',
  },
  trash: {
    fontSize: 24,
  },
  containerEmpty: {
    alignItems: 'center',
    marginTop: '10%',
  },
  img: {
    width: theme.screnn.w * 0.2,
    height: theme.screnn.w * 0.22,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  textEmpity: {
    color: theme.colors.gray300,
    fontSize: 18,
  },
});

export default List;
