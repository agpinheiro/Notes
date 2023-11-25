import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../../../theme/theme';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Description } from '../../../../services/store/Tasks/reducer';

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
  const [edit, setEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(false);

  const handleEditInput = () => {
    if (details === 'Clique aqui para editar') {
      setDetails('');
    }
    setEdit(!edit);
  };

  const handleEditTitle = () => {
    setEditTitle(!edit);
  };

  return (
    <View>
      {!editTitle ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() => handleEditTitle()}
            onLongPress={onLongPress}
          >
            <Text
              style={[
                styles.text,
                {
                  marginTop: theme.screnn.h * 0.04,
                  fontSize: 16,
                  fontWeight: '600',
                  width: theme.screnn.w * 0.8,
                  alignSelf: 'center',
                  textAlign: 'center',
                  paddingHorizontal: 20,
                  color: theme.colors.blue_dark,
                  marginBottom: 10,
                },
              ]}
            >
              {titleState}:
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TextInput
          placeholderTextColor={theme.colors.gray300}
          placeholder="Digite um titulo"
          maxLength={100}
          onChangeText={setTitleState}
          style={[
            styles.text,
            {
              marginTop: theme.screnn.h * 0.04,
              fontSize: 16,
              fontWeight: '600',
              width: theme.screnn.w * 0.8,
              alignSelf: 'center',
              textAlign: 'center',
              paddingHorizontal: 20,
              color: theme.colors.blue_dark,
              marginBottom: 10,
            },
          ]}
          value={titleState}
        />
      )}
      <View
        style={[
          styles.containerInput,
          { backgroundColor: edit ? theme.colors.gray : 'transparent' },
        ]}
      >
        {!edit ? (
          <TouchableOpacity
            onLongPress={onLongPress}
            activeOpacity={1}
            onPress={handleEditInput}
          >
            <Text
              style={[
                styles.text,
                { fontSize: 16, fontWeight: '600', textAlign: 'left' },
              ]}
            >
              {details}
            </Text>
          </TouchableOpacity>
        ) : (
          <TextInput
            placeholderTextColor={theme.colors.gray300}
            placeholder="Descreva aqui"
            style={styles.input}
            multiline
            onChangeText={setDetails}
            value={details}
          />
        )}
      </View>
      {(edit || editTitle) && (
        <TouchableOpacity
          onPress={() => {
            setEdit(false);
            setEditTitle(false);
            if (
              details !== description.details ||
              titleState !== description.title
            ) {
              onSave({
                id: description.id,
                type: 'input',
                taskId: description.taskId,
                details: details,
                title: titleState,
              });
            }
          }}
          style={{
            borderRadius: 10,
            backgroundColor: color,
            width: '30%',
            marginTop: 30,
            alignSelf: 'center',
          }}
        >
          <Text style={styles.text}>Salvar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default InputDescription;

const styles = StyleSheet.create({
  text: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  containerInput: {
    width: theme.screnn.w * 0.9,
    marginTop: 4,
    borderRadius: 10,
    alignSelf: 'center',
  },
  input: {
    margin: '3%',
    fontSize: 14,
    color: 'white',
    width: theme.screnn.w * 0.84,
    textAlignVertical: 'top',
  },
});
