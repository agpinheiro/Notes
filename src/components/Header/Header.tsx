import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import logo from '../../assets/logo.png';
import Input from '../Input/Input';
import {theme} from '../../theme/theme';

// import { Container } from './styles';

const Header: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.img} source={logo} resizeMode="contain" />
      <Input />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.black,
    width: '100%',
    height: theme.screnn.h * 0.21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {marginBottom: 20, width: 180},
});
