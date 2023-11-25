import { MMKV } from 'react-native-mmkv';
import { SharedKeys } from '../pages/Main/Main';
import { Task } from './store/Tasks/reducer';

export const storage = new MMKV({
  id: 'user-storage',
});

const localStorage = {
  setStorage: (key: string, data: any[]) => {
    storage.set(key, JSON.stringify(data));
  },
  getStorage: (key: string): any[] | [] => {
    const data = storage.getString(key);
    if (data) {
      const tasks: any[] = JSON.parse(data);
      return tasks;
    }
    return [] as any[];
  },
};

const local = {
  setStorage: (key: string, data: any) => {
    storage.set(key, JSON.stringify(data));
  },

  getKeys: (key: string): string[] => {
    const keys = storage.getString(key);
    if (keys) {
      const data = JSON.parse(keys);
      return data;
    }
    return [];
  },

  deleteKey: (key: string, selectKey: string): string[] => {
    const keys = storage.getString(key);
    if (keys) {
      const data: string[] = JSON.parse(keys);
      const filter = data.filter((item) => item !== selectKey);
      local.setStorage(key, filter);
      local.deleteStorage(selectKey);
      return filter;
    }
    return [];
  },

  getStorage: (key: string): Task[] | [] => {
    const user = storage.getString(key);
    if (user) {
      const data: Task[] = JSON.parse(user);
      return data;
    }
    return [];
  },

  deleteStorage: (key: string) => {
    storage.delete(key);
  },

  deleteItemStorage: (key: string, id: string) => {
    const json = local.getStorage(key);
    if (json.length >= 0) {
      const temp = json.filter((item: Task) => item.id !== id);
      local.setStorage(key, temp);
      return temp;
    }
    return [];
  },

  updateStorageTask: (key: string, task: Task, tasks: Task[]) => {
    const data = tasks.map((item) => {
      if (item.id === task.id) {
        item.done = !item.done;
        return item;
      }
      return item;
    });
    local.setStorage(key, data);
    return data;
  },

  updateStorageScheduleTask: (key: string, task: Task, tasks: Task[]) => {
    const data = tasks.map((item) => {
      return item;
    });
    local.setStorage(key, data);
    return data;
  },

  updateDescriptionTask: (key: string, task: Task, tasks: Task[]) => {
    const filter = tasks.filter((t) => t.id !== task.id);
    filter.push(task);
    local.setStorage(key, filter);
    return filter;
  },
  getUniqueTask: (key: string, id: string) => {
    const data = local.getStorage(key);
    const task = data.filter((t) => t.id === id);
    return task[0];
  },
};

const shared = {
  key: 'shared',
  setSharedStorage: (data: SharedKeys[]) => {
    storage.set(shared.key, JSON.stringify(data));
  },
  getSharedKeys: (): SharedKeys[] => {
    const keys = storage.getString(shared.key);
    if (keys) {
      const data = JSON.parse(keys);
      return data;
    }
    return [];
  },
  deleteSharedKey: (selectKey: string): SharedKeys[] => {
    const keys = storage.getString(shared.key);
    if (keys) {
      const data: SharedKeys[] = JSON.parse(keys);
      const filter = data.filter((item) => item.id !== selectKey);
      shared.setSharedStorage(filter);
      return filter;
    }
    return [];
  },
};

export { local, shared, localStorage };
