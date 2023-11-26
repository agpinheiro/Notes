import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from './theme/theme';
import Routes from './routes/Routes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PushNotification from 'react-native-push-notification';
import socket from './services/socket/socket';
import { Provider } from 'react-redux';
import { store } from './services/store/store';
import DeviceInfo from 'react-native-device-info';
import { userStorage } from './services/storage';

// type Url = { url: string };
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

    const userName = userStorage.getStorage('user');

    if (!userName || userName === 'User') {
      getDeviceName();
    }
    /* const handleDeepLink = ({ url }: Url) => {
      const bar = url.lastIndexOf('/');
      const id = url.substring(bar + 1);

      console.log('Deep link recebido:', id);
      console.log(id.length === generateUUID().length);
      if (id.length === generateUUID().length) {
        socket.emit('room', id);

        socket.on('initialList', (data: IList) => {
          console.log(data);
        });
      }
    }; */

    // Adicione um ouvinte para deep links
    // Linking.addEventListener('url', handleDeepLink);

    // Verifique se há deep link inicial ao iniciar o aplicativo
    /* if (Platform.OS === 'android') {
      Linking.getInitialURL().then((url) => {
        if (url) {
          handleDeepLink({ url });
        }
      });
    } */

    return () => {
      socket.disconnect();
      // Linking.removeAllListeners('url');
    };
  }, []);

  const getDeviceName = async () => {
    const name = await DeviceInfo.getDeviceName();
    userStorage.setStorage('user', name);
  };
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
