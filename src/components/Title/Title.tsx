import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {theme} from '../../theme/theme';

interface RowProps {
  name: string;
  number: string | number;
  color: string;
}
const Row = ({name, number, color}: RowProps) => {
  return (
    <View style={styles.row}>
      <Text style={[styles.textRow, {color}]}>{name}</Text>
      <Text style={styles.numberRow}>{number}</Text>
    </View>
  );
};

interface TitleProps {
  createNumber: number;
  doneNumber: number;
}

const Title: React.FC<TitleProps> = ({createNumber, doneNumber}) => {
  return (
    <View style={styles.container}>
      <Row color={theme.colors.blue} name="Criadas" number={createNumber} />
      <Row
        color={theme.colors.purple_dark}
        name="Concluídas"
        number={doneNumber}
      />
    </View>
  );
};

export default Title;

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: theme.colors.gray200,
    marginTop: '10%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textRow: {
    fontSize: 16,
    fontWeight: '900',
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
});
