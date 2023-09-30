import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Container from '../../components/Cotainer/Container';
import { RouteProps } from '../../routes/Routes';

type NavProps = RouteProps<'Main'>;


const Main: React.FC<NavProps> = ({navigation}) => {
  return (
    <Container>
      <TouchableOpacity onPress={() => navigation.navigate('Notes')}>
        <Text>Navegar</Text>
      </TouchableOpacity>
    </Container>
  );
};

export default Main;
