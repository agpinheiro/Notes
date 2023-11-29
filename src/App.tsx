import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  AppState,
  AppStateStatus,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from './theme/theme';
import Routes from './routes/Routes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PushNotification from 'react-native-push-notification';
import { Provider } from 'react-redux';
import { store } from './services/store/store';
import DeviceInfo from 'react-native-device-info';
import { controlStorage, localStorage, userStorage } from './services/storage';
import socket from './services/socket/socket';
import { token } from './config/index.json';
import { IList } from './services/store/ITaskList/reducer';
import { Overlay } from '@rneui/themed';

const App: React.FC = () => {
  const [active, setActive] = useState(false);
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
        controlStorage.setStorage(false);
        setActive(true);
      } else {
        socket.connect();
        socket.emit('auth', token);
        const tasks: IList[] = localStorage.getStorage('content');
        tasks.forEach((room) => {
          socket.emit('room', room.id);
          socket.emit('syncList', room.id);
        });
        controlStorage.setStorage(true);
        setActive(false);
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
          <Overlay
            overlayStyle={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              shadowColor: 'transparent',
            }}
            isVisible={active}
          >
            <ActivityIndicator
              size={theme.screnn.w * 0.3}
              color={theme.colors.purple}
            />
          </Overlay>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
