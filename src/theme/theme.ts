import { Dimensions } from 'react-native';

export const theme = {
  colors: {
    blue_dark: '#1E6F9F',
    blue: '#4EA8DE',
    purple_dark: '#5E60CE',
    purple: '#8284FA',
    black: '#0D0D0D',
    danger: '#E25858',
    gray: '#262626',
    gray600: '#1a1a1a',
    gray300: '#808080',
    gray200: '#D9D9D9',
    white: '#FEFEFE',
  },
  screnn: {
    w: Dimensions.get('screen').width,
    h: Dimensions.get('screen').height,
  },
};
