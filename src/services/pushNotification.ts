import PushNotification from 'react-native-push-notification';
import { Task } from '../pages/NotesPage/components/List/List';

interface Props {
  item: Task;
  key: string;
  date: Date;
}

const pushLocalSchedule = ({ item, key, date }: Props) => {
  PushNotification.localNotificationSchedule({
    channelId: 'com.notes.todolist',
    messageId: item.id,
    largeIcon: 'ic_launcher',
    smallIcon: 'ic_notification',
    soundName: 'sound.mp3',
    vibrate: true,
    title: `Lista - ${key}`,
    subText: `Prioridade - ${item.priority}`,
    message: item.task,
    date,
    allowWhileIdle: true,
  });
};

export { pushLocalSchedule };
