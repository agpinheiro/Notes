import React, { useEffect } from 'react';
import { StatusBar, AppState, AppStateStatus } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from './theme/theme';
import Routes from './routes/Routes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PushNotification from 'react-native-push-notification';
import { Provider } from 'react-redux';
import { store } from './services/store/store';
import DeviceInfo from 'react-native-device-info';
import { localStorage, userStorage } from './services/storage';
import socket from './services/socket/socket';
import { token } from './config/index.json';
import { IList } from './services/store/ITaskList/reducer';

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

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background') {
        socket.disconnect();
      } else {
        socket.connect();
        socket.emit('auth', token);
        const tasks: IList[] = localStorage.getStorage('content');
        tasks.forEach((room) => {
          socket.emit('room', room.id);
        });
      }
    };
    const appCurrentState = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      socket.disconnect();
      appCurrentState.remove();
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
