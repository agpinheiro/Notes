import PushNotification from 'react-native-push-notification';

interface Props {
  message: string;
  date: Date;
}

const pushLocalSchedule = ({ message, date }: Props) => {
  PushNotification.localNotificationSchedule({
    channelId: 'com.notes.todolist',
    largeIcon: 'ic_launcher',
    vibrate: true,
    message,
    date,
    allowWhileIdle: true,
  });
};

export { pushLocalSchedule };
