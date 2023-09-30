import { MMKV } from 'react-native-mmkv';
import { Task } from '../components/List/List';

export const storage = new MMKV({
  id: `user-storage`,
});

export const setStorage = (key: string, data: Task[]) => {
  storage.set(key, JSON.stringify(data))
}

export const getStorage = (key: string): Task[] | [] => {
  const user = storage.getString(key)
  if (user) {
    const data: Task[] = JSON.parse(user);
    return data;
  }
  return [];
}

export const deleteStorage = (key: string) => {
  storage.delete(key);
}

export const deleteItemStorage = (key: string, id: string) => {
  const json = getStorage(key)
  if (json.length > 0) {
    const temp = json.filter((item: any) => item.id !== id);
    setStorage('tasks', temp);
    return temp;
  }
  return [];
}

export const updateStorageTask = (key: string, task: Task, tasks: Task[]) => {
  const data = tasks.map(item => {
    if (item.id === task.id) {
      item.done = !item.done;
      return item;
    }
    return item;
  })
  setStorage('tasks', data);
  return data;
}
