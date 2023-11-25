import React, { useCallback, useRef } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import EmptyComponent from '../../../../components/EmptyComponent/EmptyComponent';
import Item from '../../../../components/Item/Item';
import { Task } from '../../../../services/store/Tasks/reducer';

interface Props {
  tasks: Task[];
  onPress: (item: Task) => void;
  onDone: (item: Task) => void;
  onEdit: (item: Task) => void;
  onReIndex: (item: Task, value: number) => void;
  open: boolean;
  onDate: (item: Task) => void;
}

const List: React.FC<Props> = ({
  tasks,
  onPress,
  onDone,
  onEdit,
  onReIndex,
  onDate,
  open,
}) => {
  const renderItem: ListRenderItem<Task> = ({ item, index }) => {
    return (
      <Item
        item={item}
        onDone={() => onDone(item)}
        onPress={() => onPress(item)}
        onEdit={() => onEdit(item)}
        onReIndex={(value: number) => {
          onReIndex(item, value);
          scrollToOffset(index, value);
        }}
        onDate={() => onDate(item)}
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

  const scrollToOffset = (index: number, value: number) => {
    if (
      (index === 0 && value === 1) ||
      (tasks.length - 1 === index && value === -1)
    ) {
      return;
    }
    flatlistRef.current?.scrollToIndex({
      animated: true,
      index: index - value,
    });
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
