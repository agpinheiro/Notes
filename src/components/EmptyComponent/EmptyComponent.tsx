import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Logo from '../../assets/logo.svg';
import { theme } from '../../theme/theme';

interface Props {
  title: string;
  info: string;
}

const EmptyComponent: React.FC<Props> = ({ title, info }) => {
  return (
    <View style={styles.containerEmpty}>
      <Logo
        style={{ opacity: 0.7 }}
        width={theme.screnn.w * 0.2}
        height={theme.screnn.w * 0.2}
      />
      <Text style={styles.textEmpityTitle}>{title}</Text>
      <Text style={styles.textEmpityInfo}>{info}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  containerEmpty: {
    alignItems: 'center',
    marginTop: '14%',
  },
  textEmpityTitle: {
    color: theme.colors.gray300,
    fontSize: 18,
    fontWeight: '700',
  },
  textEmpityInfo: {
    color: theme.colors.gray300,
    fontSize: 18,
    fontWeight: '300',
  },
});

export default EmptyComponent;
