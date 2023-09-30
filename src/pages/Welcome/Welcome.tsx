import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {RouteProps} from '../../routes/Routes';
import Container from '../../components/Cotainer/Container';

type NavProps = RouteProps<'Welcome'>;

const Welcome: React.FC<NavProps> = ({navigation}) => {
  return (
    <Container>
      <TouchableOpacity onPress={() => navigation.navigate('Notes')}>
        <Text>Navegar</Text>
      </TouchableOpacity>
    </Container>
  );
};

export default Welcome;
