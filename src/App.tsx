import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from './theme/theme';
import Routes from './routes/Routes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PushNotification from 'react-native-push-notification';
import socket from './services/socket';
import { Provider } from 'react-redux';
import { store } from './services/store/store';

const App: React.FC = () => {
  useEffect(() => {
    PushNotification.createChannel(
      {
        channelName: 'NotesApp',
        channelId: 'com.notes.todolist',
        playSound: true,
        soundName: 'sound.mp3',
        vibrate: true,
        importance: 4,
      },
      (created) => console.log(created),
    );

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <StatusBar backgroundColor={theme.colors.black} />
          <Routes />
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
