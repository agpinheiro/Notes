import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import NotesPage from '../pages/NotesPage/NotesPage';
import Welcome from '../pages/Welcome/Welcome';
import Main from '../pages/Main/Main';

export type StackProps = {
  Welcome: undefined;
  Main: undefined;
  Notes: undefined;
};

export type RouteProps<RouteName extends keyof StackProps> =
  NativeStackScreenProps<StackProps, RouteName>;

const Stack = createNativeStackNavigator<StackProps>();

const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Notes" component={NotesPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
