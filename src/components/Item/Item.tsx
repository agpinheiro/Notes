import React from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../theme/theme';
import { Icon } from '@rneui/themed';
import { Task } from '../../pages/NotesPage/components/List/List';
import SwipleBase from '../SwipleBase/SwipleBase';
import { formatDate } from '../../utils/format';

interface Props {
  item: Task;
  onDone: () => void;
  onPress: () => void;
  onEdit: () => void;
  onReIndex: (value: number) => void;
  open: boolean;
  onDate: () => void;
}

interface ColorProps {
  color: string;
  border: string;
  icon: boolean;
  colorText: string;
  decoration: 'line-through' | 'none';
  borderItem: string;
}

const Item: React.FC<Props> = ({
  item,
  onDone,
  onPress,
  onEdit,
  onReIndex,
  onDate,
  open,
  id,
}) => {
  const handleColorBoder = () => {
    if (item.priority === 'Alta') {
      return theme.colors.danger;
    }
    if (item.priority === 'Media') {
      return theme.colors.purple_dark;
    }
    return theme.colors.blue;
  };

  const handleColor = () => {
    if (item.done) {
      const colors: ColorProps = {
        color: theme.colors.purple_dark,
        border: theme.colors.purple_dark,
        icon: true,
        colorText: theme.colors.gray200,
        decoration: 'line-through',
        borderItem: handleColorBoder(),
      };
      return colors;
    }
    const colors: ColorProps = {
      color: theme.colors.gray,
      border: theme.colors.blue_dark,
      icon: false,
      colorText: theme.colors.white,
      decoration: 'none',
      borderItem: handleColorBoder(),
    };
    return colors;
  };
  const color: ColorProps = handleColor();
  return (
    <SwipleBase
      width={open ? 0.2 : 0.4}
      onPress={(value: number) => onReIndex(value)}
      onDate={onDate}
    >
      <TouchableOpacity
        onLongPress={onEdit}
        activeOpacity={1}
        style={{
          backgroundColor: theme.colors.gray,
          width: '100%',
          flexDirection: 'row',
          height: theme.screnn.h * 0.11,
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: color.borderItem,
        }}
      >
        {item.date && (
          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              top: 2,
              right: 8,
              alignItems: 'center',
            }}
          >
            {item.schedule && new Date() < item.date && (
              <Icon
                name="megaphone"
                type="foundation"
                size={12}
                color={theme.colors.white}
              />
            )}
            <Text
              style={{
                color: theme.colors.white,
                marginLeft: 10,
                fontSize: 12,
              }}
            >
              {formatDate(item.date)}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={{
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={onDone}
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
              { backgroundColor: color.color, borderColor: color.border },
            ]}
          >
            {color.icon && (
              <Icon
                name="check"
                type="feather"
                size={20}
                color={theme.colors.white}
              />
            )}
          </View>
        </TouchableOpacity>

        <Text
          numberOfLines={2}
          style={[
            {
              width: '78%',
              textAlign: 'left',
            },
            {
              color: color.colorText,
              textDecorationLine: color.decoration,
              fontSize: item.task.length > 60 ? 15 : 16,
            },
          ]}
        >
          {item.task}
        </Text>
        <Pressable onPress={onPress}>
          {({ pressed }) => (
            <Icon
              name="trash"
              type="font-awesome"
              size={28}
              color={pressed ? theme.colors.danger : theme.colors.white}
            />
          )}
        </Pressable>
      </TouchableOpacity>
    </SwipleBase>
  );
};

export default Item;
