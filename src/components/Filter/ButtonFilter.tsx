import { Icon } from '@rneui/themed';
import React, { Dispatch, SetStateAction } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { theme } from '../../theme/theme';

interface Props {
  activeFilter: boolean;
  setActiveFilter: (value: boolean) => void | Dispatch<SetStateAction<boolean>>;
}

const ButtonFilter: React.FC<Props> = ({ activeFilter, setActiveFilter }) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignSelf: 'flex-end',
        marginRight: 20,
        marginTop: '3%',
      }}
      onPress={() => setActiveFilter(!activeFilter)}
    >
      <Text
        style={{
          color: theme.colors.white,
          marginRight: 10,
          fontWeight: '600',
        }}
      >
        Prioridade
      </Text>
      <Icon name="filter" type="font-awesome" color={theme.colors.white} />
    </TouchableOpacity>
  );
};

export default ButtonFilter;
