import React, { ReactNode, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { theme } from '../../theme/theme';
import { Icon } from '@rneui/themed';

interface Props {
  children: ReactNode;
  onPress: (value: number) => void;
}

const SwipleBase: React.FC<Props> = ({ children, onPress }) => {
  const renderRight = () => {
    return (
      <View
        style={[
          styles.right,
          {
            width: theme.screnn.w * 0.2,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => onPress(1)}
          style={{
            alignItems: 'center',
            paddingLeft: 10,
            justifyContent: 'center',
            width: '100%',
            height: '50%',
            backgroundColor: theme.colors.blue,
            borderTopRightRadius: 8,
          }}
        >
          <Icon
            name="arrow-bold-up"
            type="entypo"
            size={30}
            color={theme.colors.white}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onPress(-1)}
          style={{
            alignItems: 'center',
            paddingLeft: 10,
            justifyContent: 'center',
            width: '100%',
            height: '50%',
            backgroundColor: theme.colors.purple,
            borderBottomRightRadius: 8,
          }}
        >
          <Icon
            name="arrow-bold-down"
            type="entypo"
            size={30}
            color={theme.colors.white}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable
      overshootRight={false}
      renderRightActions={(_x, _y, e) => renderRight()}
    >
      {children}
    </Swipeable>
  );
};

export default SwipleBase;

const styles = StyleSheet.create({
  right: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginLeft: -theme.screnn.w * 0.04,
  },
});
