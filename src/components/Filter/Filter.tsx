import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../theme/theme';
import { Priority } from '../Header/Header';

interface Option {
  name: string;
  color: string;
  type: Priority | '';
}

const options: Option[] = [
  { name: 'Limpar Filtro', color: theme.colors.white, type: '' },
  { name: 'Baixa', color: theme.colors.blue, type: 'Baixa' as Priority },
  { name: 'Média', color: theme.colors.purple_dark, type: 'Media' as Priority },
  { name: 'Alta', color: theme.colors.danger, type: 'Alta' as Priority },
];

interface Props {
  onPress: (option: Priority | '') => void;
}

const Filter: React.FC<Props> = ({ onPress }) => {
  return (
    <View
      style={{
        backgroundColor: theme.colors.gray600,
        width: theme.screnn.w * 0.3,
        height: theme.screnn.h * 0.2,
        position: 'absolute',
        right: 20,
        top: '41%',
        zIndex: 2,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        borderColor: theme.colors.white,
        borderWidth: 0.3,
      }}
    >
      {options.map((option) => (
        <TouchableOpacity
          key={option.color}
          onPress={() => {
            onPress(option.type);
          }}
          style={{
            width: '100%',
            height: '20%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: option.color }}>{option.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Filter;
