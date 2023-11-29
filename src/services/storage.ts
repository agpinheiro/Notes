import { MMKV } from 'react-native-mmkv';

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

const userStorage = {
  setStorage: (key: string, data: string) => {
    storage.set(key, JSON.stringify(data));
  },
  getStorage: (key: string): string => {
    const data = storage.getString(key);
    if (data) {
      const tasks: string = JSON.parse(data);
      return tasks;
    }
    return 'User';
  },
};

const controlStorage = {
  setStorage: (data: boolean) => {
    storage.set('control', JSON.stringify(data));
  },
  getStorage: (): boolean => {
    const data = storage.getString('control');
    if (data) {
      const control: boolean = JSON.parse(data);
      return control;
    }
    return false;
  },
};

export { localStorage, userStorage, controlStorage };
