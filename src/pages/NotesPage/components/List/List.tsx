import React, { useCallback, useRef } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import EmptyComponent from '../../../../components/EmptyComponent/EmptyComponent';
import Item from '../../../../components/Item/Item';
import { Priority } from '../../../../components/Header/Header';
import { theme } from '../../../../theme/theme';

export interface Task {
  id: string;
  task: string;
  done: boolean;
  priority?: Priority;
}

interface Props {
  tasks: Task[];
  onPress: (id: string) => void;
  onDone: (item: Task) => void;
  onEdit: (item: Task) => void;
  onReIndex: (item: Task, value: number) => void;
  open: boolean;
}

const List: React.FC<Props> = ({
  tasks,
  onPress,
  onDone,
  onEdit,
  onReIndex,
  open,
}) => {
  const renderItem: ListRenderItem<Task> = ({ item }) => {
    return (
      <Item
        item={item}
        onDone={() => onDone(item)}
        onPress={() => onPress(item.id)}
        onEdit={() => onEdit(item)}
        onReIndex={(value: number) => {
          onReIndex(item, value);
          scrollToOffset(theme.screnn.h * -0.1 * value);
        }}
        open={open}
      />
    );
  };

  const ItemSeparator = useCallback(() => {
    return <View style={{ height: 14 }} />;
  }, []);

  const EmptyItem = useCallback(() => {
    return (
      <EmptyComponent
        title="Você ainda não tem tarefas cadastradas"
        info="Crie tarefas e organize seus itens a fazer"
      />
    );
  }, []);

  const flatlistRef: React.LegacyRef<FlatList<Task>> = useRef(null);

  const scrollToOffset = (offset: number) => {
    flatlistRef.current.scrollToOffset({ animated: true, offset });
  };

  return (
    <View
      style={{
        flex: 1,
        marginTop: '3%',
        alignItems: 'center',
        marginHorizontal: 20,
      }}
    >
      <FlatList
        data={tasks}
        ref={flatlistRef}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={{ width: '100%' }}
        ListEmptyComponent={EmptyItem}
        contentContainerStyle={{ paddingBottom: 60 }}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export default List;
