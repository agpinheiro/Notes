import PushNotification from 'react-native-push-notification';
import { Task } from '../pages/NotesPage/components/List/List';

interface Props {
  item: Task;
  date: Date;
}

const pushLocalSchedule = ({ item, date }: Props) => {
  PushNotification.localNotificationSchedule({
    channelId: 'com.notes.todolist',
    messageId: item.id,
    largeIcon: 'ic_launcher',
    smallIcon: 'ic_notification',
    vibrate: true,
    title: `Prioridade: ${item.priority}`,
    message: item.task,
    date,
    allowWhileIdle: true,
  });
};

export { pushLocalSchedule };
