import { List } from '../store/List/reducer';
import { Description, Task } from '../store/Tasks/reducer';
import { formattedTasks } from './formattedTasks';
import socket from './socket';

const handleEmmitterAndUpdatedListsShared = async (
  list: List[],
  task: Task[],
  description: Description[],
) => {
  const tasks = formattedTasks(list, task, description);

  await Promise.all(
    tasks.map((t) => {
      return socket.on('updateList', { id: t.list.id, data: t });
    }),
  );
};

export { handleEmmitterAndUpdatedListsShared };
