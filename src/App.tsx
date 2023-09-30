import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {theme} from './theme/theme';
import Routes from './routes/Routes';

function App(): JSX.Element {
  return (
    <>
      <SafeAreaProvider>
        <StatusBar backgroundColor={theme.colors.black} />
        <Routes />
      </SafeAreaProvider>
    </>
  );
}

export default App;
