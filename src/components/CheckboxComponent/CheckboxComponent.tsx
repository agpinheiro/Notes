import { Icon } from '@rneui/themed';
import React from 'react';
import { Text } from 'react-native';
import { TouchableOpacity, View } from 'react-native';

interface Props {
  name: string;
  value: boolean;
  colors: {
    name: string;
    selected: string;
    unselected: string;
  };
  onPress: () => void;
}

const CheckboxComponent: React.FC<Props> = ({
  name,
  value = false,
  colors,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={{
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
      }}
      onPress={onPress}
    >
      <View
        style={[
          {
            width: 24,
            height: 24,
            borderRadius: 15,
            borderWidth: 2,
            alignItems: 'center',
            justifyContent: 'center',
          },
          { borderColor: colors.unselected },
        ]}
      >
        {value && (
          <Icon name="check" type="feather" size={20} color={colors.selected} />
        )}
      </View>
      <Text style={{ color: colors.name, marginLeft: 10, fontWeight: '900' }}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export default CheckboxComponent;
