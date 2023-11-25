import { List } from '../store/List/reducer';
import { Description, Task } from '../store/Tasks/reducer';

interface DataTransferSocket {
  list: List;
  task: Task[];
}

const formattedTasks = (
  list: List[],
  task: Task[],
  description: Description[],
) => {
  const newTask: Task[] = [];
  task.forEach((t) => {
    const filter = description.filter((d) => d.taskId === t.id);
    newTask.push({ ...t, description: filter });
  });

  const newKey: DataTransferSocket[] = [];

  list.forEach((l) => {
    newKey.push({
      list: l,
      task: newTask.filter((t) => t.listId === l.id),
    });
  });

  const dataTask = newKey.filter((n) => n.list.shared);
  return dataTask;
};

export { formattedTasks };
