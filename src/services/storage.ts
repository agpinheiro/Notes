import { MMKV } from 'react-native-mmkv';
import { Task } from '../pages/NotesPage/components/List/List';

export const storage = new MMKV({
  id: 'user-storage',
});

export const setStorage = (key: string, data: any) => {
  storage.set(key, JSON.stringify(data));
};

export const getKeys = (key: string): string[] => {
  const keys = storage.getString(key);
  if (keys) {
    const data = JSON.parse(keys);
    return data;
  }
  return [];
};

export const deleteKey = (key: string, selectKey: string): string[] => {
  const keys = storage.getString(key);
  if (keys) {
    const data: string[] = JSON.parse(keys);
    const filter = data.filter((item) => item !== selectKey);
    setStorage(key, filter);
    deleteStorage(selectKey);
    return filter;
  }
  return [];
};

export const getStorage = (key: string): Task[] | [] => {
  const user = storage.getString(key);
  if (user) {
    const data: Task[] = JSON.parse(user);
    return data;
  }
  return [];
};

export const deleteStorage = (key: string) => {
  storage.delete(key);
};

export const deleteItemStorage = (key: string, id: string) => {
  const json = getStorage(key);
  if (json.length >= 0) {
    const temp = json.filter((item: Task) => item.id !== id);
    setStorage(key, temp);
    return temp;
  }
  return [];
};

export const updateStorageTask = (key: string, task: Task, tasks: Task[]) => {
  const data = tasks.map((item) => {
    if (item.id === task.id) {
      item.done = !item.done;
      return item;
    }
    return item;
  });
  setStorage(key, data);
  return data;
};

export const updateStorageScheduleTask = (
  key: string,
  task: Task,
  tasks: Task[],
) => {
  const data = tasks.map((item) => {
    return item;
  });
  setStorage(key, data);
  return data;
};
