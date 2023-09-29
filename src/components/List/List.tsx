import React from 'react';
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {theme} from '../../theme/theme';

interface Props {
  id: string;
  task: string;
  selected: boolean;
}

const data: Props[] = [
  {
    id: '1',
    task: 'Integer urna interdum massa libero auctor neque turpis turpis semper.',
    selected: true,
  },
  {
    id: '2',
    task: 'Integer urna interdum massa libero auctor neque turpis turpis semper.',
    selected: true,
  },
  {
    id: '3',
    task: 'Integer urna interdum massa libero auctor neque turpis turpis semper.',
    selected: false,
  },
];
const Item: ListRenderItem<Props> = ({item}) => {
  return (
    <View style={styles.item}>
      <TouchableOpacity style={styles.check}>
        {item.selected && <Text style={styles.ok}>OK!</Text>}
      </TouchableOpacity>

      <Text style={styles.text}>{item.task}</Text>
      <TouchableOpacity>
        <Text style={styles.trash}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
};

const ItemSeparator = () => {
  return <View style={{height: 14}} />;
};

const List: React.FC = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={Item}
        style={{width: '100%'}}
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
    color: theme.colors.white,
    fontSize: 14,
    maxWidth: '78%',
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: theme.colors.purple,
    backgroundColor: theme.colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ok: {
    color: theme.colors.white,
    fontSize: 10,
  },
  trash: {
    fontSize: 24,
  },
});

export default List;
