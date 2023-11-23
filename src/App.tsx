import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from './theme/theme';
import Routes from './routes/Routes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PushNotification from 'react-native-push-notification';

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
    /* PushNotification.localNotification({
      title: 'Hello World!',
      message: 'This is a test notification',
      channelId: 'com.notes.todolist',
      userInfo: {},
      playSound: true,
      soundName: 'sound.mp3',
    }); */
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar backgroundColor={theme.colors.black} />
        <Routes />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
