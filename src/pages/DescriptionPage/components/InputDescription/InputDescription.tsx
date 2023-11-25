import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '../../../../theme/theme';
import { TextInput } from 'react-native-gesture-handler';
import { Icon } from '@rneui/themed';
import { Description } from '../../../../services/store/ITaskList/reducer';

interface Props {
  color: string;
  description: Description;
  onLongPress: () => void;
  onSave: (item: Description) => void;
}

const InputDescription: React.FC<Props> = ({
  color,
  description,
  onLongPress,
  onSave,
}) => {
  const [details, setDetails] = useState(description.details);
  const [titleState, setTitleState] = useState(description.title);

  return (
    <View style={styles.container}>
      <View style={[styles.row, { justifyContent: 'space-between' }]}>
        <TextInput
          placeholderTextColor={theme.colors.gray300}
          placeholder="Digite um titulo"
          onChangeText={setTitleState}
          style={[styles.text, { color: color, padding: 0, margin: 0 }]}
          value={titleState}
          onEndEditing={() => {
            if (details !== description.details) {
              onSave({
                id: description.id,
                type: 'input',
                taskId: description.taskId,
                listId: description.listId,
                details: details,
                title: titleState,
              });
            }
          }}
        />
        <Icon
          onPress={onLongPress}
          name="trash"
          type="font-awesome"
          size={24}
          color={theme.colors.white}
        />
      </View>
      <TextInput
        placeholderTextColor={theme.colors.gray300}
        placeholder="Escreva aqui"
        onChangeText={setDetails}
        onEndEditing={() => {
          if (details !== description.details) {
            onSave({
              id: description.id,
              type: 'input',
              taskId: description.taskId,
              listId: description.listId,
              details: details,
              title: titleState,
            });
          }
        }}
        multiline
        style={[
          styles.text,
          {
            padding: 0,
            margin: 0,
            fontWeight: '500',
            marginTop: 10,
          },
        ]}
        value={details}
      />
    </View>
  );
};

export default InputDescription;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.gray,
    marginHorizontal: '4%',
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    borderColor: theme.colors.white,
  },
  row: {
    flexDirection: 'row',
  },
  text: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'left',
  },
});
