import { Icon } from '@rneui/themed';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { theme } from '../../theme/theme';

interface Props {
  onPress: () => void;
  icon: string;
  type:
    | 'material'
    | 'material-community'
    | 'simple-line-icon'
    | 'zocial'
    | 'font-awesome'
    | 'octicon'
    | 'ionicon'
    | 'foundation'
    | 'evilicon'
    | 'entypo'
    | 'antdesign'
    | 'font-awesome-5';
  title: string;
  color?: string;
}

const ButtonFilter: React.FC<Props> = ({
  onPress,
  icon,
  type,
  title,
  color = theme.colors.white,
}) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignSelf: 'flex-end',
        marginHorizontal: 20,
        marginTop: '3%',
      }}
      onPress={onPress}
    >
      <Text
        style={{
          color: color,
          marginRight: 10,
          fontWeight: '600',
        }}
      >
        {title}
      </Text>
      <Icon name={icon} type={type} color={color} />
    </TouchableOpacity>
  );
};

export default ButtonFilter;
